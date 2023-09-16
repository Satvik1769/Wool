const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(cors())
app.use(bodyParser.json())



mongoose.connect("mongodb+srv://Satvik1769:IRONMAN@instadapp.zr8a5jl.mongodb.net/").then(()=>{
    console.log('Connected to database');
}).catch((e)=>{
    console.error(`Error connecting to the db ${e}`);
})

// Import Routes
const authRoute = require('./routes/index');
const postRoute = require('./routes/posts');

// Route Middlewares
app.use('/auth', authRoute);
app.use('/posts',postRoute);

const port = 3001;
app.listen(port, function(){console.log("Server running on localhost:" + port)});