const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadSingleImage, resizeSingleUserImage } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


// AUTH ROUTES
router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

// VERIFICATION ROUTES
router.patch('/verify-otp', authController.verifyOtp);
router.patch('/request-otp', authController.requestOtp);

// FORGOT AND RESET ROUTES
router.patch('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassord);



// ROUTE FOR PROTECTED USER
router.get('/users/me', isAuthProtected, userController.getMe);
// router.patch('/upload-image', uploadSingleImage, resizeSingleUserImage, isAuthProtected, userController.uploadProfileImage);
router.patch('/users/delete-account', isAuthProtected, userController.deleteAccount);
router.patch('/users/update-password', isAuthProtected, authController.updatePassword);


// ROUTES RESTRICTED TO JUST ADMINS
router.get('/users/', isAuthProtected, isRestricted, userController.getEveryUsers);
router.get('/users/:id', isAuthProtected, isRestricted, userController.getUserById);
router.patch('/users/:id', isAuthProtected, isRestricted, userController.updateUser);
router.delete('/users/:id', isAuthProtected, isRestricted, userController.deleteUser);


module.exports = router;