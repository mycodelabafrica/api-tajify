const path = require('path')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
//////////////////////////////////////////////
const authRouter = require("./routes/authRoute")
const walletRouter = require("./routes/walletRoute")
const profileRouter = require("./routes/profileRoute")
const channelsRouter = require("./routes/channelsRoute")
const rewardRouter = require("./routes/rewardRoute")
const connectsRouter = require("./routes/connectRoute")


const app = express();


//////////////////////////////////////////////
//// MIDDLEWARES ////
//////////////////////////////////////////////

// MORGAN REQUEST MIDDLEWARE
app.use(morgan("dev"));

// EXPRESS BODY PARSER
app.use(express.json({ limit: "10mb" }));

// COOKIE PARSER
app.use(cookieParser());

// CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// ALLOWING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(_, res) {
    const filePath = './public/doc.html';
    res.sendFile(filePath, { root: __dirname });
});


// REQUEST GLOBAL MIDDLEWARE
app.use(function (_, _, next) {
	console.log("Making Request..");
    
	next();
});


//////////////////////////////////////////////
//// MOUNTING ROUTES ////
//////////////////////////////////////////////
app.use('/api/auth', authRouter);
app.use('/api/wallets', walletRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/connects', connectsRouter);
app.use('/api/rewards', rewardRouter);


module.exports = app;