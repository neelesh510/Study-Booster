const express=require('express');
const router=express.Router();
const Course = require("../Models/Course");
const { auth,isStudent } = require('../middlewares/auth');

router.get('/', auth, isStudent, async (req, res) => {
    try {
      // Get the student ID from the authenticated user or request body
      const studentId = req.user.id;
      const enrolledCourses = await Course.findById(studentId)
      .populate('courses');
  
      // Return the enrolled courses of students
      res.render('get-allCourses.ejs',{allCourses:enrolledCourses});
      
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