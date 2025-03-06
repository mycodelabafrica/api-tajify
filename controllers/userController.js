const User = require("../models/usersModel");
const refactory = require('../controllers/handleRefactory');
const { asyncWrapper } = require('../utils/handlers');
// const { filterObj } = require("../utils/helpers");


const refactoryParameter = [User, 'user'];

exports.getEveryUsers = refactory.getAll(...refactoryParameter);
exports.getUserById = refactory.getOne(...refactoryParameter);
exports.updateUser = refactory.updateOne(...refactoryParameter);
exports.deleteUser = refactory.deleteOne(...refactoryParameter);


exports.getMe = asyncWrapper(async function(req, res) {
    const user = await User.findById(req.user._id);

    if(!user || !user.isActive) {
        return res.json({
            message: "User is inactive or no longer exist",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})


exports.uploadProfileImage = asyncWrapper(async function (req, res) {
    const id = req.user._id;

    let image;
    if(req.file) image =  `/assets/users/${req.file.filename}`;

    await User.findByIdAndUpdate(id, { image }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        message: 'Profile image uploaded'
    });
});

// USER DELETE USER ACCOUNT (AUTHORISED)
exports.deleteAccount = asyncWrapper(async function(req, res) {
    const { password } = req.body;
    
    // CHECK IF THE PROVIDED PASSWORD IS CORRECT
    const user = await User.findById(req.user._id).select('+password');
    const comparedPassword = await user.comparePassword(password, user.password)
    if (!comparedPassword) return res.json({ message: "Incorrect password " });

    await User.findByIdAndUpdate(user._id, { isActive: false });
    req.session.destroy();
    res.clearCookie('jwt');

    res.status(204).json({
        status: "success",
        message: 'Account deleted!',
        data: null
    });
})
  
// // USER UPDATES PROFILE (AUTHORISED)
// exports.updateAc = asyncWrapper(async function (req, res) {
//     const { password, passwordConfirm} = req.body;

//     // CHECK IF USER ISN'T TRYINGG TO UPDATE PASSWORD ON THIS ROUTE
//     if(password || passwordConfirm) {
//         return res.json({ 
//             message: 'This route is not for password updates. Please use /update-Password.'
//         });
//     }
    
//     // FILTER WHAT CAN BE EDITED
//     const filterArray = ["email", "fullname", "country", "phoneNumber", "state"]
//     const filteredBody = filterObj(req.body, ...filterArray);
//     const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
//         new: true,
//         runValidators: true
//     });

//     res.status(200).json({
//         status: "success",
//         message: 'Profile Updated!',
//         data: { user }
//     });
// });