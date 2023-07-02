const express = require("express");
const app = express();
const path= require("path");
const bodyParser = require('body-parser')
const flash = require("flash");
const session = require("express-session");
// app.use("body-parser")
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'));
app.set("view-engine" , "ejs");
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

mongoose.connect("mongodb://0.0.0.0/UserAPI",{

}).then(() =>{
    console.log("connection successfull");
}).catch(()=>{
    console.log("no connection");
});

const homeroutes = require("./routes/home")
app.use("/", homeroutes);

const Users = require('./Models/Users');

const signuproutes = require("./routes/signup");
app.use("/signup",signuproutes);

app.post("/signup",Users);

const loginrouts = require("./routes/login");
app.use("/login",loginrouts);

const paymentrouts = require("./routes/paymentSuccessEmail");
app.use("/paymentSuccessEmail",paymentrouts);

app.listen(port,()=>{
    console.log(`connection is setup at ${port}`);
});