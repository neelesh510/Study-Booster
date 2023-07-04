const express=require('express');
const router=express.Router();

const Course = require("../Models/Course")
const Category = require("../Models/Category")
const User = require("../Models/Users")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const {auth} = require('../middlewares/auth');
const profileInfo = require("../Models/ProfileInfo");

router.get('/Courses',auth,async (req, res) => {
    try {
      const allCourses = await Course.find(
        { status: "Published" },
        {
          courseName: true,
          price: true,
          thumbnail: true,
        }
      )
      res.render("get-allCourses.ejs",{allCourses:allCourses});

    } catch (error) {
      console.log(error)
      return res.status(404).json({
        success: false,
        message: `Can't Fetch Course Data`,
        error: error.message,
      })
    }
  });


// Router
router.get('course/:courseId', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId)
      .populate('instructor', 'name email')
      .populate('ratingAndReviews')
      .populate('studentsEnrolled');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found`,
      });
    }
    const instructorEmail = course.instructor.email;
    const instructorInfo = profileInfo.find({email:instructorEmail});
    if(!instructorEmail) {
      return res.status(404).json({
        success: false,
        message: ` not found`,
      });
    }
   
    res.render("get-course.ejs", { course: course },{instructorInfo:instructorInfo});

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error retrieving course details`,
      error: error.message,
    });
  }
});


module.exorts = router;
  