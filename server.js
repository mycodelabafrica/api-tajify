const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 3222;
const HOST = process.env.HOST;

//////////////////////////////////////////////
//// DATABASE CONNECTION ////
//////////////////////////////////////////////
const DBSTRING = process.env.DATABASE?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

async function connectDB() {
    try {
        await mongoose.connect(DBSTRING);
        console.log('Database connected successfully!');

    } catch(err) {
        console.log(err.message);
    }
}
connectDB();


//////////////////////////////////////////////
//// SERVER CONFIGURATION ////
//////////////////////////////////////////////
app.listen(PORT, HOST, function() {
    console.log(`Server is listening on port ${PORT}...`);
});