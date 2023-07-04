const express=require('express');
const router=express.Router();
const flash = require("flash");
const session = require("express-session");
 const bcrypt = require("bcrypt");
const Users = require("../Models/Users");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender');
require("dotenv").config();
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
			AccountType,
		} = req.body;
		// Check if All Details are there or not
		if (
		
			!name||
			!email ||
			!password ||
			!cpassword || 
			!AccountType
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
			AccountType,
		});

        const otp = otpGenerator.generate(6,
			                  { digits: true,
								upperCaseAlphabets: false,
								lowerCaseAlphabets: false,
								specialChars: false,
								});
	// Set OTP expiration to 5 minutes from now
	const otpExpiration = new Date(Date.now() + 5 * 60000);

		mailSender(email,"Verification Email for OTP ",otp)
		    .then(() => {
				// Save the user and OTP details to the database 
		        user.otp=otp;
				user.otpExpiration=otpExpiration;
				// Render the OTP verification form
				res.render('otpVerification.ejs', { email: req.body.email ,error: null});
			  })
			  .catch((error) => {
				console.error('Error sending OTP:', error);
				// Handle error
				res.redirect('/signup');
			  });        
          //  res.render("home.ejs");
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
});


router.post('/verify', (req, res) => {
	const { email, otp } = req.body;
  
	// Verify the OTP from the database
	const isOTPValid = verifyOTPFromDatabase(email, otp);
  
	if (isOTPValid) {
	  // Mark the user account as verified in the database
	  // Redirect to a success profile page 
	  res.redirect('/profileInfo');
	} else {
	  // Handle invalid OTP
	  res.render('otpVerification', { email, error: 'Invalid OTP. Please try again.' });
	}
  });
   
  function verifyOTPFromDatabase(email, otp) {
	return Users.findOne({ email: email, otp: otp, otpExpiration: { $gt: new Date() } })
	  .then((user) => {
		return !!user; // Return true if a matching user is found, false otherwise
	  })
	  .catch((error) => {
		console.error('Error verifying OTP from database:', error);
		return false; // Handle error and return false
	  });
  }

module.exports = router;



