const mongoose = require('mongoose');


//////////////////////////////////////////////
//// SCHEMA CONFIGURATION  ////
//////////////////////////////////////////////

const walletSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
        unique: true,
    },
    taji: {
        type: Number,
        default: 0,
    },
    rewardPoint: {
        type: Number,
        default: 0,
    },
    voteCredit: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////

walletSchema.pre(/^find/, function (next) {
	this.populate({
		path: "profile",
		select: "_id username",
	});

	next();
});


//////////////////////////////////////////////
//// MODEL AND COLLECTION ////
//////////////////////////////////////////////
const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;