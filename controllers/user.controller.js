const User = require("../models/user.model");

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
		let userDetail = req.body;
		let user = new User(userDetail);
		user.save((err, user) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send(user);
			}
		});
	} catch (error) {
		res.status(500).send(error);
	}
};
const fetchUserById = (req, res) => {};

const uploadAvatar = async (req, res) => {
	const { id } = req.params;
	const result = await uploadS3.uploadFile(req.file);
	console.log(result);
	// To delete file from local after upload to S3
	await unlinkFile(req.file.path);

	let user = await User.findById(id);
	user.avatar = result.key;
	user.save();

	res.send({ imagePath: `/avatar/${result.key}` });
};

const downloadAvatar = async (req, res) => {
	const readStream = await uploadS3.downloadFile(req.params.key);
	// To convert binary data to media type
	readStream.pipe(res);
};

module.exports = {
	fetchAllUsers,
	createUser,
	fetchUserById,
	uploadAvatar,
	downloadAvatar,
};
