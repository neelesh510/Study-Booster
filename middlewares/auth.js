
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Models/Users");

const auth = async (req, res, next) => {
  try {
    // Extract token 
    const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
   // console.log("token");
    // If token is missing, return error response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById({ _id: decoded.id });

      // If user not found in the database, return error response
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      // Attach the user to the request object
      req.user = user;
      next();
    } catch (err) {
      // Token verification failed
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    // Something went wrong while validating the token
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
const isStudent = async (req, res, next) => {
  try{
         if(req.user.AccountType !== "Student") {
             return res.status(401).json({
                 success:false,
                 message:'This is a protected route for Students only',
             });
         }
         next();
  }
  catch(error) {
     return res.status(500).json({
         success:false,
         message:'User role cannot be verified, please try again'
     })
  }
 }
 
 
 //isInstructor
 const isInstructor = async (req, res, next) => {
     try{
            if(req.user.AccountType !== "Instructor") {
                return res.status(401).json({
                    success:false,
                    message:'This is a protected route for Instructor only',
                });
            }
            next();
     }
     catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
     }
    }
 
 
 //isAdmin
 const isAdmin = async (req, res, next) => {
     try{    
            console.log("Printing AccountType ", req.user.AccountType);
            if(req.user.AccountType !== "Admin") {
                return res.status(401).json({
                    success:false,
                    message:'This is a protected route for Admin only',
                });
            }
            next();
     }
     catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
     }
    }

module.exports = {auth, isAdmin,isInstructor,isStudent};
