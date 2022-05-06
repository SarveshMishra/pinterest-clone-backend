const User = require("../models/user.model");
const activeToken = require("../models/activeToken.model");
const uploadS3 = require("../database/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const tokenGenerator = require("../lib/JWTToken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
const createUser = async (req, res) => {
	let userDetail = req.body;

	const findUser = User.findOne({ email: userDetail.email });

	findUser.then((user) => {
		if (user != null) {
			if (user.facebookId != "") {
				res
					.status(400)
					.json({ message: "User already exists, please login with facebook" });
			} else if (user.googleId != "") {
				res
					.status(400)
					.json({ message: "User already exists, please login with google" });
			} else if (user) {
				res
					.status(500)
					.json({ message: "User already exists, Try login with email" });
			}
		} else {
			bcrypt.hash(userDetail.password, saltRounds, function (err, hash) {
				if (err) {
					res.status(500).send(err);
				} else {
					userDetail.password = hash;
					let user = new User(userDetail);
					user.save(async (err, user) => {
						if (err) {
							res.status(500).json({
								message: err,
							});
						} else {
							const token = await tokenGenerator.generateToken({
								id: user._id,
								name: user.name,
								email: user.email,
								avatar: user.avatar,
							});
							const newToken = new activeToken({
								token: token,
								userId: user._id,
							});
							newToken.save((err, token) => {
								if (err) {
									res.status(500).json({
										message: err,
									});
								} else {
									res.status(200).json({
										success: true,
										token,
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

const fetchUserById = (req, res) => {
	let userId = req.user.id;
	console.log(req.user);

	User.findById(userId, (err, user) => {
		if (err) {
			res.status(500).json({
				message: err,
			});
		} else {
			res.status(200).json({
				success: true,
				user: {
					name: user.name,
					email: user.email,
					avatar: user.avatar,
				},
			});
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

	const user = await User.findOne({ email });
	// console.log(user);

	if (!user) {
		res.status(404).json({ message: "User does not exist" });
	} else {
		bcrypt.compare(password, user.password, async function (err, result) {
			if (err) {
				res.status(500).json({
					message: err,
				});
			} else {
				if (result) {
					const token = await tokenGenerator.generateToken({
						id: user._id,
						name: user.name,
						email: user.email,
						avatar: user.avatar,
					});

					const newToken = new activeToken({
						token: token,
						userId: user._id,
					});
					newToken.save((err, token) => {
						if (err) {
							res.status(500).json({
								message: err,
							});
						} else {
							res.status(200).json({
								success: true,
								token,
							});
						}
					});
				} else {
					res.status(400).json({
						message: "Password is incorrect",
					});
				}
			}
		});
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
				res.status(500).json({
					message: err,
				});
			} else {
				res.status(200).json({
					success: true,
					user,
				});
			}
		});
	}
};

const signOut = (req, res) => {
	let id = req.user.id;
	activeToken.findOneAndDelete({ userId: id }, (err, user) => {
		if (err) {
			res.status(500).json({
				message: err,
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Logout successfully",
			});
		}
	});
};
module.exports = {
	fetchAllUsers,
	createUser,
	fetchUserById,
	uploadAvatar,
	downloadAvatar,
	login,
	updateUser,
	signOut,
};
