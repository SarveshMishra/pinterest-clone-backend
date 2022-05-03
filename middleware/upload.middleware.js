const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const uploadAvatar = (req, res, next) => {
    console.log(req);
	upload.single("avatar")(req, res, (err) => {
		if (err) {
			res.status(500).send(err);
		} else {
			next();
		}
	});
};

module.exports = {
	uploadAvatar,
};
