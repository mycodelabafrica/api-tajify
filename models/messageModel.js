const mongoose = require("mongoose");
const slugify = require("slugify");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        messageSlug: {
            type: String,
            unique: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Generate `messageSlug` before saving
messageSchema.pre("save", function (next) {
    if (this.isNew) {
        this.messageSlug = slugify(this.message.substring(0, 20) + "-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8), { lower: true });
    }
    next();
});

// Auto-populate sender and receiver
messageSchema.pre(/^find/, function (next) {
    this.populate({ path: "sender", select: "_id username" }).populate({
        path: "receiver",
        select: "_id username",
    });
    next();
}); 

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
