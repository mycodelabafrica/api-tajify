const Wallet = require("../models/walletsModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");


exports.getAllUserWallets = refactory.getAll(Wallet, "wallet");
exports.createUserWallet = refactory.createOne(Wallet, "wallet", "profile");
exports.deleteUserWallet = refactory.deleteOne(Wallet, "wallet");

// GET CURRENT USER WALLET
exports.getMyWallet = asyncWrapper(async function(req, res) {
    const userId = req.user._id;

    const userWallet = await Wallet.findOne({ user: userId });
    if(!userWallet) return res.json({ message: "You dont have a wallet yet" });

    res.status(200).json({
        status: "success",
        data: { wallet: userWallet }
    })
});