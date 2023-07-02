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
        // unique: [true,"Email is already present"],
        // validator(value){
        //     if(validator.isEmail(value)){
        //         throw new Error("Invalid Email");
        //     }
        // }
    },
    password : {
        type : String,
        required : true

    },
    cpassword : {
        type : String,
        required : true

    }
});

module.exports = mongoose.model('users',userSchema);;