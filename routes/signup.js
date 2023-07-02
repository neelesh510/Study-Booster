const express=require('express');
const router=express.Router();
const flash = require("flash");
const session = require("express-session");
//const user = require('../Models/Users');
//  const signup = require("../Controllers/auth");
 const bcrypt = require("bcrypt");
const Users = require("../Models/Users");
const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const { route } = require('./home');

router.get('/',(req,res)=>{
    
    res.render("signup.ejs");
})
 
router.post('/',async(req,res)=>{
    try {
		// Destructure fields from the request body
		const {
			
			name,
			email,
			password,
			cpassword,
			
		} = req.body;
		console.log(req.body.name);
		// Check if All Details are there or not
		if (
		
			!name||
			!email ||
			!password ||
			!cpassword
			
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== cpassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await Users.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}


		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);


		const user = await Users.create({
			name,
			email,			
			password: hashedPassword,
	        cpassword,
		});

            res.render("home.ejs");
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
});

module.exports = router;