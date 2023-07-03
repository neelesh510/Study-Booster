const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true

    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true

    },
    token: {
        type: String,
    },
    otp:{
       type:String,
    },
    otpExpiration:{
        type:String,
    },
    cpassword : {
        type : String,
    }
});

module.exports = mongoose.model('users',userSchema);;