const mongoose = require("mongoose");
const slugify = require("slugify");

const audiobookSchema = new mongoose.Schema({
     creatorProfile: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
     },
     title: {
          type: String,
          required: true,
          trim: true,
     },
     coverImage: {
          url: { type: String, required: true },
          public_id: String,
     },
     specification: {
          author: {
               type: String,
               required: true,
               trim: true,
          },
          description: {
               type: mongoose.Schema.Types.Mixed,
               trim: true,
          },
          publishedYear: Number,
          genre: [String],
     },
     audio: {
          url: {
               type: String,
               required: true,
          },
          public_id: String,
          duration_in_seconds: Number,
     },
     slug: String,
     stream: {
          type: Number,
          default: 0,
     },
     likes: {
          type: Number,
          default: 0,
     },
}, {
    timestamps: true,
});



audiobookSchema.pre("save", function (next) {
	if (this.isNew || this.isModified("title")) {
		this.slug = slugify(this.title, { lower: true });
	}
	next();
});

audiobookSchema.pre(/^find/, function (next) {
	this.populate({
          path: "creatorProfile",
          select: "_id username profileName"
     });
	next();
});

const Audiobook = mongoose.model("Audiobook", audiobookSchema);
module.exports = Audiobook;
