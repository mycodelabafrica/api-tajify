const express = require('express');
const connectController = require('../controllers/connectController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.post("/message", isAuthProtected, connectController.sendMessage);



module.exports = router;