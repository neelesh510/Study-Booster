const express=require('express');
const router=express.Router();
const { auth,isInstructor } = require('../middlewares/auth');
const Course = require("../Models/Course");

router.get('/', auth, isInstructor, async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.render('get-allCourses.ejs',{allCourses:instructorCourses});
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  });

  module.exports = router;