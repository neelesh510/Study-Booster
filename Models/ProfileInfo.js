const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
    email: {
        type: String,
    },
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
    image:{
        type:String,
    }
});

// Export the Profile model
module.exports = mongoose.model("ProfileInfo", profileSchema);
