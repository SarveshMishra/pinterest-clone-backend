const User = require("../models/user.model");
const googleUser = require("../models/google.model");
const facebookUser = require("../models/facebook.model");
const uploadS3 = require("../database/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const fetchAllUsers = (req, res) => {
	try {
		User.find({}, (err, users) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send(users);
			}
		});
	} catch (error) {
		res.status(500).send(error);
	}
};
const createUser = (req, res) => {
	try {
		console.log(req.body);
		let userDetail = req.body;

		const findUser = User.findOne({ email: userDetail.email });
		const findGoogleUser = googleUser.findOne({ email: userDetail.email });
		const findFacebookUser = facebookUser.findOne({ email: userDetail.email });
		if (findUser) {
			res.status(400).send("User already exists");
		} else if (findGoogleUser) {
			res.status(400).send("User already exists, Try login with Google");
		} else if (findFacebookUser) {
			res.status(400).send("User already exists, Try login with Facebook");
		} else {
			let user = new User(userDetail);
			user.save((err, user) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(200).send(user);
				}
			});
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

const fetchUserById = (req, res) => {
	let userId = req.query.id;
	console.log(userId);
	User.findById(userId, (err, user) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(user);
		}
	});
};

const uploadAvatar = async (req, res) => {
	const { id } = req.params;
	const result = await uploadS3.uploadFile(req.file);
	console.log(result);
	// To delete file from local after upload to S3
	await unlinkFile(req.file.path);

	let user = await User.findById(id);
	const img_url = `${process.env.BASE_URL}/users/${user._id}/avatar/${result.key}`;
	user.avatar = img_url;
	user.save();

	res.send({ imagePath: `${img_url}` });
};

const downloadAvatar = async (req, res) => {
	const readStream = await uploadS3.downloadFile(req.params.key);
	// To convert binary data to media type
	readStream.pipe(res);
};
const login = async (req, res) => {
	const { email, password } = req.body;

	const findGoogleUser = googleUser.findOne({ email: userDetail.email });
	const findFacebookUser = facebookUser.findOne({ email: userDetail.email });
	if (findGoogleUser) {
		res.status(400).send("Try login with Google");
	} else if (findFacebookUser) {
		res.status(400).send("Try login with Facebook");
	} else {
		const user = await User.findOne({ email });

		if (!user) {
			res.status(404).send("User not exists");
		} else {
			if (user.password == password) {
				res.status(200).send(user);
			} else {
				res.status(401).send("Password is incorrect");
			}
		}
	}
};
const updateUser = async (req, res) => {
	const { id } = req.query;
	const { name, email, password } = req.body;
	const user = await User.findById(id);
	console.log(user);
	if (!user) {
		res.status(404).send("User not found");
	} else {
		if (name) user.name = name;
		if (email) user.email = email;
		if (password) user.password = password;

		user.save((err, user) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send(user);
			}
		});
	}
};

module.exports = {
	fetchAllUsers,
	createUser,
	fetchUserById,
	uploadAvatar,
	downloadAvatar,
	login,
	updateUser,
};
