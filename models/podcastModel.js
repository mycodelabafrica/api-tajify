const mongoose = require("mongoose");
const slugify = require("slugify");


const podcastSchema = new mongoose.Schema({
    creatorProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    coverImage: {
        url: { type: String, required: true },
        public_id: String
    },
    episodes: [{
        title: String,
        description: String,
        audio: {
            url: String,
            public_id: String,
            duration_in_sec: Number,
        },
        streams: Number,
        addedDate: {
            type: Date,
            default: Date.now
        }
    }],
    slug: String,
    likes: Number,
}, {
    timestamps: true
});



podcastSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("name")) {
        const slug = slugify(this.name, { lower: true, replacement: "-" });
        this.slug = slug;
    }

    next();
});

podcastSchema.pre(/^find/, function(next) {
    this.populate({
        path: "creatorProfile",
        select: "_id username",
    });

    next();
});


const Podcast = mongoose.model("Podcast", podcastSchema);
module.exports = Podcast;