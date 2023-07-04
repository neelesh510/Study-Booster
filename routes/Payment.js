const express=require('express');
const router=express.Router();
const enrollStudents = require("../Controllers/enrollStudent");
const {instance} = require("../config/razorpay");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const { auth, isStudent } = require('../middlewares/auth');

router.get('/',auth,isStudent,(req,res)=>{

    res.render("payment.ejs");
})
//initiate the razorpay order
router.post( '/',auth,isStudent, async(req, res) => {

    const course = req.body;
    const userId = req.user.id;

    // if(!course) {
    //     return res.json({success:false, message:"Please provide Course"});
    // }

    let totalAmount = 0;

        try{
           
           // course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            const uid  = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

//verify the payment
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

});

    // const sendPaymentSuccessEmail = async(req, res) => {
    //     const {orderId, paymentId, amount} = req.body;
    
    //     const userId = req.user.id;
    
    //     if(!orderId || !paymentId || !amount || !userId) {
    //         return res.status(400).json({success:false, message:"Please provide all the fields"});
    //     }
    
    //     try{
    //         //find out student
    //         const enrolledStudent = await User.findById(userId);
    //         await mailSender(
    //             enrolledStudent.email,
    //             `Payment Recieved`,
    //              paymentSuccessEmail(`${enrolledStudent.firstName}`,
    //              amount/100,orderId, paymentId)
    //         )
    //     }
    //     catch(error) {
    //         console.log("error in sending mail", error)
    //         return res.status(500).json({success:false, message:"Could not send email"})
    //     }
    // }
    

module.exports = router;