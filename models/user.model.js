const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, default: "User" },
	email: { type: String, required: true },
	password: { type: String, default: "123456" },
	avatar: {
		type: String,
		default:
			"https://microbiology.ucr.edu/sites/g/files/rcwecm2866/files/styles/form_preview/public/blank-profile-pic.png?itok=xMM7pLfb",
	},
	age: { type: Number, default: 0 },
	role: {
		type: String,
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	googleId: { type: String, default: "" },
	facebookId: { type: String, default: "" },
});

module.exports = mongoose.model("user", userSchema);
