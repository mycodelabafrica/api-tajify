const mongoose = require("mongoose");
const slugify = require("slugify");


const audioSchema = new mongoose.Schema({
    creatorProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    slug: String,
    streams: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    audio: {
        public_id: String,
        duration_in_sec: Number,
        url: { type: String, required: true },
    },
    coverImage: {
        url: { type: String, required: true },
        public_id: String
    },
}, {
    timestamps: true
});

 

audioSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("title")) {
        const slug = slugify(this.title, { lower: true, replacement: "-" });
        this.slug = slug;
    }

    next();
});

audioSchema.pre(/^find/, function(next) {
    this.populate({
        path: "creatorProfile",
        select: "_id username",
    });

    next();
});


const Audio = mongoose.model("Audio", audioSchema);
module.exports = Audio;