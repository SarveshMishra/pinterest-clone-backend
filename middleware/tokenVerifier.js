const jwt = require("jsonwebtoken");

const tokenVerifier = (req, res, next) => {
	const token = req.headers.token;
	if (!token) {
		res.status(401).json({ message: "No token, authorization denied" });
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			res.status(401).json({ message: "Token invalid" });
		}
		req.user = payload;
		next();
	});
};
module.exports = tokenVerifier;
