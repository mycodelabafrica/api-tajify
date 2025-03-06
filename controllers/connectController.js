const Call = require("../models/callModel")
const Profile = require('../models/profileModel');
const Message = require("../models/messageModel")
const { asyncWrapper } = require("../utils/handlers")

// Create a call only if both the user and creator are following each other
exports.createCall = asyncWrapper(async (req, res) => {
    const { caller, receiver, callType } = req.body;

    // Check if receiver is a creator
    const receiverProfile = await Profile.findOne({ user: receiver, isCreator: true });

    if (!receiverProfile) {
        return res.status(404).json({
            success: false,
            message: "Receiver is not a creator."
        });
    }

    // Check if caller is following the receiver and vice versa
    const callerProfile = await Profile.findOne({ user: caller });

    if (!callerProfile || !callerProfile.following.includes(receiver)) {
        return res.status(403).json({
            success: false,
            message: "You must follow the creator to call them."
        });
    }

    if (!receiverProfile.following.includes(caller)) {
        return res.status(403).json({
            success: false,
            message: "The creator must follow you back to allow a call."
        });
    }

    const newCall = await Call.create({ 
        caller,
        receiver,
        callType
        
         });

    res.status(201).json({
        success: true,
        message: 'Call created successfully',
        data: newCall
    });
});



// Send a message only if both the user and creator are following each other
exports.sendMessage = asyncWrapper(async (req, res) => {
    const { sender, receiver, message } = req.body;

    // Check if receiver is a creator
    const receiverProfile = await Profile.findOne({ user: receiver, isCreator: true });

    if (!receiverProfile) {
        return res.status(404).json({
            success: false,
            message: "Receiver is not a creator."
        });
    }

    // Check if sender is following the receiver and vice versa
    const senderProfile = await Profile.findOne({ user: sender });

    if (!senderProfile || !senderProfile.following.includes(receiver)) {
        return res.status(403).json({
            success: false,
            message: "You must follow the creator to message them."
        });
    }

    if (!receiverProfile.following.includes(sender)) {
        return res.status(403).json({
            success: false,
            message: "The creator must follow you back to allow messaging."
        });
    }

    const newMessage = await Message.create({ sender, receiver, message });

    res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: newMessage
    });
});
