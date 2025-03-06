const express = require('express');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const profileController = require("../controllers/profileController");

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/", isAuthProtected, isRestricted, profileController.getAllProfiles)
router.get("/my-profile", isAuthProtected, profileController.getMyProfile)
router.post("/become-a-creator", isAuthProtected, isRestricted(["user"]), profileController.becomeCreator);

////////////////////////////////////////////////////

router.patch("/follow-creator", isAuthProtected, profileController.followCreator);
router.patch("/unfollow-cretor", isAuthProtected, profileController.unfollowCreator);
router.patch("/follow-creator/back", isAuthProtected, profileController.followBackCreator);

////////////////////////////////////////////////////
router.get("/followers", isAuthProtected, profileController.getMyFollowers);
router.get("/followings", isAuthProtected, profileController.getMyFollowings);

////////////////////////////////////////////////////
// router.get("/creator/followers", isAuthProtected, profileController.getMyFollowers);
// router.get("/creator/followings", isAuthProtected, profileController.getMyFollowings);



module.exports = router;