const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcrypt');


//////////////////////////////////////////////
//// SCHEMA CONFIGURATION  ////
//////////////////////////////////////////////
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        lowercase: true,
        required: true,
    },
    phoneNumber: String,
    username: String,
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, "Enter a valid email"],
        lowercase: true,
        required: true,
    },
    password: {
        type:String,
        required: true,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same!',
        }
    },
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    },
    referralCode: String,
    isActive: {
        type: Boolean,
        default: true
    },
    slug: String,
    lastSeen: String,

    // OPT & EMAIL VERIFICATIONS
    otpCode: { type: Number, select: false },
    isOtpVerified: { type: Boolean, default: false},
    otpIssuedAt: { type: Date, Default: Date.now },
    otpExpiresIn: Date,
    optVerifiedAt: Date,

    // PASSWORD 
    passwordChangedAt: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
}, {
    timestamps: true,
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////
const saltRound = 12;
userSchema.pre('save', async function(next) {
    // CHECK IF PASSWORD IS ALREADY MODIFIED
    if(!this.isModified('password')) return next();

    // IF NOT HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(this.password, saltRound);
    this.password = hashedPassword;
    this.passwordConfirm = undefined

    next();
});

userSchema.pre("save", async function (next) {
    // UPDATE FIELD ONLY WHEN PASSWORD IS TRULY CHANGED
	if (this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 100;
	next();
});

userSchema.pre("save", function (next) {
    if (this.isNew || this.isModified('fullname')) {
        // CREATING AND UPDATING USER SLUG
        const slug = slugify(this.fullname, { lower: true });
        this.slug = `${slug}-${this._id.toString().slice(0, 4)}`;
    }
    
	next();
});

userSchema.pre("save", function (next) {
    // OTP CODE EXPIRES IN 3 MINS (180 SECS)
    if(this.isNew || this.isModified('otpIssuedAt')) {
        this.otpExpiresIn = Date.now() + 3 * 60 * 1000;
    }
	next();
})


//////////////////////////////////////////////
//// INSTANCE METHODS ////
//////////////////////////////////////////////

userSchema.methods.isOTPExpired = function () {
    // CHECK IF THE OTP HAS EXPIRED
	if (this.otpCode || this.otpExpiresIn) {
        const currentTime = new Date(Date.now());
        const ExpiresTime = new Date(this.otpExpiresIn);

        const remainingSec = Number((ExpiresTime - currentTime) / 1000).toFixed(0) || 0;
        const isOTPExpired = currentTime > ExpiresTime;
        console.log(isOTPExpired, remainingSec)
		return { isOTPExpired, remainingSec };
	}
	return false;
};


userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return jwtTimeStamp < changeTimeStamp;
	}
	// return false means not changed
	return false;
};

userSchema.methods.comparePassword = async function (plainPassword, hashedPassword) {
	const encrypted = await bcrypt.compare(plainPassword, hashedPassword);
	return encrypted;
};

userSchema.methods.createPasswordResetToken = function() {
	// create random bytes token
	const resetToken = crypto.randomBytes(32).toString("hex");

	// simple hash random bytes token
	const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.passwordResetToken = hashedToken;

	// create time limit for token to expire (10 mins)
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	// send the unencrypted version
	return resetToken;
};


//////////////////////////////////////////////
//// MODEL AND COLLECTION ////
//////////////////////////////////////////////
const User = mongoose.model('User', userSchema);
module.exports = User;