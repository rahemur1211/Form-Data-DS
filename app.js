require("dotenv").config();
require('express-async-errors');


const connectDB = require('./db/connect');
const mainRouter = require('./routes/User');
const cors = require('cors');
const port = process.env.PORT  || 5050;
const express = require("express");
const app = express();


app.use(express.json())
app.use(cors())
app.use("/api/v1", mainRouter);


const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch(error){
        console.log(error);
    }
}

start()