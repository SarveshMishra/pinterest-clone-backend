const activeToken = require("../models/activeToken.model");

const isTokenActive = (req, res, next) => {
	let token = req.headers.token;
	
	if (token) {
		activeToken.findOne({ token }, (err, token) => {
			if (err) {
				res.status(500).json({
					message: err,
				});
			} else {
				if (token) {
					next();
                } else {
                    res.status(401).json({
                        message: "Token is not active",
                    });
                }
			}
		});
	} else {
		res.status(401).json({
			message: "Token is not provided",
		});
	}
};
module.exports = isTokenActive;
