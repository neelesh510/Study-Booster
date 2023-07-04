const Course = require("../Models/Course");
const User = require("../Models/User");
const mailSender = require("../utils/mailSender");

exports.enrollStudents = async(course, userId, res) => {

    if(!course || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

        try{
            //find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {course},
            {$push:{studentsEnrolled:userId}},
            {new:true},
        )

        if(!enrolledCourse) {
            return res.status(500).json({success:false,message:"Course not Found"});
        }

        //find the student and add the course to their list of enrolledCOurses
        const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{
                courses: course.id,
            }},{new:true})
            
        ///Send email to student
        const emailResponse = await mailSender(
            enrollStudents.email,
            `Successfully Enrolled into ${enrolledCourse.courseName} course`,
            enrolledCourse.price);
            
        //console.log("Email Sent Successfully", emailResponse.response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }