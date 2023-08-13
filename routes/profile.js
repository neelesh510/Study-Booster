const express=require('express');
const router=express.Router();
const User = require("../Models/Users");
const {auth} = require('../middlewares/auth');
const profileInfo = require("../Models/ProfileInfo");

router.get('/',auth, async (req, res) => {
    const userId = req.user.id;
  
   // User.findById(userId, (err, user) => {
      //const user=User.findById(userId);
      const user=await User.findById(userId).exec();
      if (!user) {
        // Handle the error, such as showing an error page or sending an error response
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      const userEmail=user.email;
      const userInfoQuery = profileInfo.findOne({ email: userEmail });
      const userInfo = await userInfoQuery.exec();
      console.log(user);
      console.log(userEmail);
      // User found, render the create course page or perform other actions
      res.render('profile.ejs',{user : user,userInfo : userInfo});
    });

module.exports=router;