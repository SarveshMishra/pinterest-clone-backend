const User = require("../models/user.model");

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

module.exports = {
	fetchAllUsers,
	createUser,
	fetchUserById,
};
