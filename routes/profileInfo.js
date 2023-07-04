const profileInfo = require("../Models/ProfileInfo");
const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('profile-info.ejs');
})

router.post('/',async(req,res)=>{
     // Get all required fields from request body
  try{
     let {
        email,
        gender,
        dateOfBirth,
        about,
        contactNumber,
      } = req.body
      // Get  image from request files
      const Image = req.files.image;
      // Check if any of the required fields are missing
      if (
        !email ||
        !about ||
        !contactNumber||
        !Image 
       
      )
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        })

        const newDetails = await profileInfo.create({
          email,
          gender,
          dateOfBirth,
          about,
          contactNumber,
          image:Image.secure_url
        })
     }

     catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
    }

})

module.exports = router;