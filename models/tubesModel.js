const mongoose = require("mongoose");
const slugify = require("slugify");
const { nanoid } = require("nanoid");


const tubesSchema = new mongoose.Schema({
    creatorProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    title: { type: String, trim: true },
    description: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ["tube-short", "tube-max", "tube-prime"],
        required: true,
    },
    hashTags: [String],
    video: { 
        public_id: String,
        duration_in_sec: Number,
        url: { type: String, required: true },
    },
    thumbnail: {
        url: { type: String, required: true },
        public_id: String,
    },
    slug: String,
    lastModified: { type: Date, default: null },
}, {
    timestamps: true,
});



tubesSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("title")) {
        const title = this.title;
        const slug = title ? slugify(title, { lower: true, replacement: "-" }) : nanoid()
        this.slug = slug;
    }

    next();
});


tubesSchema.pre("save", function(next) {
    if(this.createdAt == this.updatedAt) {
        this.lastModified = null;
    } else {
        this.lastModified = this.updatedAt
    }

    next();
});


tubesSchema.pre(/^find/, function(next) {
    this.populate({
        path: "creatorProfile",
        select: "_id profileName username profileImage",
    });

    next();
})


const Tube = mongoose.model("Tube", tubesSchema);
module.exports = Tube;