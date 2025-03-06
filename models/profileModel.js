const mongoose = require("mongoose");


const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    profileName: String,
    username: String,
    profileImage: { url: String, public_id: String },
    coverPhoto: { url: String, public_id: String },
    bio: { type: mongoose.Schema.Types.Mixed },
    website: String,
    country: String,
    state: String,
    city: String,
    zipCode: String,
    isCreator: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId }],
	following: [{ type: mongoose.Schema.Types.ObjectId }],
    postCount: { type: Number, default: 0 },
    interests: [String],
}, {
    timestamps: true,
});


const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;