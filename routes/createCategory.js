const express=require('express');
const router=express.Router();
const User = require("../Models/Users");
const Course = require("../Models/Course")
const Category = require("../Models/Category")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {auth,isAdmin} = require('../middlewares/auth');


router.get('/',auth,isAdmin, (req, res) => {
    const userId = req.user.id;
  
   // User.findById(userId, (err, user) => {
      const user=User.findById(userId);
      if (!user) {
        // Handle the error, such as showing an error page or sending an error response
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      // User found, render the create course page or perform other actions
      res.render('create-category.ejs',{user : user});
    });

  router.post('/', auth,isAdmin, async (req, res) => {
    try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		res.render("success.ejs",{heading:"Category Created",message:"Category Created Successfully"});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
  })

  module.exports = router;