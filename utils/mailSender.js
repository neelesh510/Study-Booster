const nodemailer = require("nodemailer");

const mailSender = async (email, title, otp) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'StudyBooster - Priya',
                to:`${email}`,
                subject: `${title}`,
                text: `Your OTP for verification: ${otp}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;