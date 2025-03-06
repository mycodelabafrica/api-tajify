const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    extraPayload: {
        identifier: { type: String, default: null },
        value: { type: mongoose.SchemaTypes.ObjectId, default: null},
    },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread',
    }
});



const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;