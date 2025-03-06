const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    caller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    callType: {
        type: String,
        required: true
    },
    callAccepted: {
        type: Boolean,
        default: false
    },
    callSlug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

// Slugify the Call ID
callSchema.pre("save", function (next) {
    if (this.isNew) {
        this.callSlug = `${this.caller}-${this.receiver}-${Date.now()}`;
    }
    next();
});

// Auto-populate caller and receiver
callSchema.pre(/^find/, function (next) {
    this.populate({ path: "caller", select: "_id username" })
        .populate({ path: "receiver", select: "_id username" });
    next();
});

const Call = mongoose.model('Call', callSchema);
module.exports = Call;
