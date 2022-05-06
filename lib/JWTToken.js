require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = async (payload) => {
	let token = jwt.sign(payload, `${process.env.JWT_SECRET}`, {
		expiresIn: "1h",
	});
	return token;
};

module.exports = { generateToken };
