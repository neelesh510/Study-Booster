const express = require("express");
const app = express();
const path= require("path");
const bodyParser = require('body-parser')
const flash = require("flash");
const session = require("express-session");
const database = require("./config/database");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use(express.static('public'));
app.set("view-engine" , "ejs");

//PORT
const port = process.env.PORT || 4000;

//database connection
database.connect();

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
const homeroutes = require("./routes/home")
app.use("/", homeroutes);

const signuproutes = require("./routes/signup");
app.use("/signup",signuproutes);

const loginrouts = require("./routes/login");
app.use("/login",loginrouts);

const createCourse= require("./routes/createCourse");
app.use("/course",createCourse);

const createCategory= require("./routes/createCategory");
app.use("/category",createCategory);

const courseDetails= require("./routes/showCourse");
app.use("/courses",courseDetails);

const paymentroutes = require("./routes/Payment");
app.use("/payment",paymentroutes);

const ProfileInfo = require("./routes/profileInfo");
app.use("/profileInfo",ProfileInfo);

const enrolledCoursesRoutes = require("./routes/enrolledCourses");
app.use("enrollCourses",enrolledCoursesRoutes);

const instructorCoursesRoutes = require("./routes/instructorCourses");
app.use("enrollCourses",instructorCoursesRoutes);

const rating = require("./routes/RatingAndReview");
app.use('/',rating);


app.listen(port,()=>{
    console.log(`connection is setup at ${port}`);
});