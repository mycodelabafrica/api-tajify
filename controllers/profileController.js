const Notification = require("../models/notificationModel");
const Profile = require("../models/profileModel");
const { asyncWrapper } = require("../utils/handlers");
const { filterObj, formatDate, countNum } = require("../utils/helpers");
const refactory = require("./handleRefactory");



//////////////////////////////////////////////////
// PROFILE IMPLEMENTATIONS
//////////////////////////////////////////////////
exports.becomeCreator = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const already_a_Creator = await Profile.findOne({ user: userId })

    if(already_a_Creator.isCreator) return res.json({
        message: "Cannot process request, You are already a creator!"
    })

    const creatorProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { isCreator: true },
        { runValidators: true, new: true }
    );

    res.status(200).json({
        status: "success",
        message: "You are now a Creator!",
        data: creatorProfile
    })
});

exports.getAllProfiles = refactory.getAll(Profile, "Profile")

exports.getMyProfile = asyncWrapper(async function(req, res) {
    const creatorId = req.user._id;

    const profile = await Profile.findOne({ user: creatorId });
    if(!profile.isCreator) return res.json({ message: "You are not yet a creator!" });

    res.status(201).json({
        status: "success",
        data: { profile }
    })
});

exports.updateProfile = asyncWrapper(async function(req, res) {
    const creatorId = req.user._id;

    const profile = await Profile.findOne({ user: creatorId });
    if(!profile.isCreator) return res.json({
        message: "You are not yet a creator!"
    });

    const filterArray = ["bio", "website", "country", "country", "city", "zipCode", "interests"];
    const filteredBody = filterObj(req.body, ...filterArray);

    const updatedProfile = await Profile.findOneAndUpdate(
        { user: creatorId }, filteredBody,
        { runValidators: true, new: true }
    );

    res.status(201).json({
        status: "success",
        message: "Profile Updated!",
        data: {
            profile: updatedProfile
        }
    })
});


//////////////////////////////////////////////////
// FOLLOW IMPLEMENTATIONS
//////////////////////////////////////////////////
exports.followCreator = asyncWrapper(async function(req, res) {
    const currentUserId = req.user._id;
    const profileId = req.params.id;

    const currentProfile = await Profile.findOne({ user: currentUserId });
    const profileToFollow = await Profile.findOne({ _id: profileId, isCreator: true });
    if(!profileToFollow) return res.json({ message: "Only creators can be followed" });

    if (currentProfile.following.includes(profileToFollow._id)) {
        return res.json({ message: "Already following creator" });
    }

    profileToFollow.followers.push(currentProfile._id);
    await profileToFollow.save({ validateBeforeSave: false });

    currentProfile.following.push(profileToFollow._id);
    await currentProfile.save({ validateBeforeSave: false });

    await Notification.create({
        userId: profileToFollow.user,
        title: `@${currentProfile.username}`,
        content: `started following you ${formatDate}`,
        extraPayload: { identifier: "Follower Id", value: currentProfile._id }
    });

    res.status(200).json({
        status: 'success',
        message: "Follow request sent!",
    });
});

exports.followBackCreator = asyncWrapper(async function(req, res) {
    const currentUserId = req.user._id;
    const profileId = req.params.id;

    const currentProfile = await Profile.findOne({ user: currentUserId });
    const profileToFollowBack = await Profile.findOne({ user: profileId, isCreator: true });
    if(!profileToFollowBack) return res.json({ message: "Only creators can be followed back" });

    if(currentProfile.following.includes(profileToFollowBack._id)) {
        return res.json({ message: "Already following creator" });
    }

    profileToFollowBack.followers.push(currentProfile._id);
    await profileToFollowBack.save({ validateBeforeSave: false });

    currentProfile.following.push(profileToFollowBack._id);
    await currentProfile.save({ validateBeforeSave: false });

    await Notification.create({
        user: profileToFollowBack._id,
        title: `@${currentProfile.username}`,
        content: `followed you back ${formatDate}`,
    });

    res.status(200).json({
        status: 'success',
        message: "Follow request sent!",
    });
});

exports.unfollowCreator = asyncWrapper(async function(req, res) {
    const currentUserId = req.user._id;
    const profileId = req.params.id;

    const currentProfile = await Profile.findOne({ user: currentUserId });
    const profileToUnfollow = await Profile.findOne({ user: profileId, isCreator: true });

    if(!profileToUnfollow || !currentProfile.following.includes(profileToUnfollow.id)) {
        return res.json({ message: "Only unfollow creator you already follow" });
    }

    profileToUnfollow.followers.filter((id) => id !== currentProfile._id);
    await profileToUnfollow.save({ validateBeforeSave: false });

    currentProfile.following.filter((id) => id !== profileToUnfollow._id);
    await currentProfile.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: "Follow request sent!",
    });
})

exports.getMyFollowers = asyncWrapper(async function(req, res) {
    const creatorId = req.user.id;
    const profile = await Profile.findOne({ user: creatorId, isCreator: true });
    if(!profile) return res.json({ message: "You are not a creator" });

    const followers = [...profile.followers];
    res.status(200).json({
        status: "success",
        count: countNum(followers.length),
        data: { followers }
    })
});

exports.getMyFollowings = asyncWrapper(async function(req, res) {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId });
    const followings = [...profile.following];

    res.status(200).json({
        status: "success",
        count: countNum(followings.length),
        data: { followings }
    })
});