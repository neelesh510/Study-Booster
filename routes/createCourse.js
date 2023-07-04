const express=require('express');
const router=express.Router();
const User = require("../Models/Users");
const Course = require("../Models/Course")
const Category = require("../Models/Category")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {auth,isInstructor} = require('../middlewares/auth');

router.get('/',auth,isInstructor, (req, res) => {
    const userId = req.user.id;
  
   // User.findById(userId, (err, user) => {
      const user=User.findById(userId);
      if (!user) {
        // Handle the error, such as showing an error page or sending an error response
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      // User found, render the create course page or perform other actions
      res.render('create-course.ejs',{user : user});
    });

  router.post('/', auth,isInstructor, async (req, res) => {
    try {
        // Get user ID from request object
        const userId = req.user.id
    
        // Get all required fields from request body
        let {
          courseName,
          courseDescription,
          whatYouWillLearn,
          price,
          category,
          status,
        } = req.body
        // Get thumbnail image from request files
        const thumbnail = req.files.thumbnailImage;
         const courseContent = req.files.courseContent;
        // Check if any of the required fields are missing
        if (
          !courseName ||
          !courseDescription ||
          !whatYouWillLearn ||
          !price ||
          !thumbnail ||
          !category 
        ) {
          return res.status(400).json({
            success: false,
            message: "All Fields are Mandatory",
          })
        }
        if (!status || status === undefined) {
          status = "Draft"
        }
        // Check if the user is an instructor
        // const instructorDetails = await User.findById(userId, {
        //     accountType: "Instructor",
        //   })

        const instructorDetails = await User.findById(userId);

        if (!instructorDetails) {
          return res.status(404).json({
            success: false,
            message: "Instructor Details Not Found",
          })
        }
          console.log("categoryDetails");
        // Check if the tag given is valid
        const categoryDetails = await Category.find({name:category});
       if (!categoryDetails) {
         return res.status(404).json({
         success: false,
         message: "Category Details Not Found",
         })
       }

        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        console.log(thumbnailImage)
        // Create a new course with the given details
        const newCourse = await Course.create({
          courseName,
          courseDescription,
          instructor: instructorDetails._id,
          whatYouWillLearn: whatYouWillLearn,
          price,
          category,
          thumbnail: thumbnailImage.secure_url,
          status: status,
          courseContent: [courseContent.secure_url],
        })
         
        // Add the new course to the User Schema of the Instructor
        await User.findByIdAndUpdate(
          instructorDetails._id,
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        );  console.log("category create ho gyi");
        
        // Add the new course to the Categories
        const categoryDetails2 = await Category.findOneAndUpdate(
            { name: category },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        )
        console.log("HIII")
        // Return a success message
        res.render("success.ejs",{heading:"Course Created",message:"Course Created Successfully"});

      } catch (error) {
        // Handle any errors that occur during the creation of the course
        console.error(error)
        res.status(500).json({
          success: false,
          message: "Failed to create course",
          error: error.message,
        })
      }
  });
  
  module.exports = router;