const savedImage = require("../models/saved_image.model");

const getSavedImage = (req, res) => {
	let user_id = req.query.id;
	let image = savedImage.find({ user_id: user_id });
	image.exec((err, image) => {
		if (err) {
			res.status(500).send({
				message: err.message,
			});
		} else {
			res.status(200).send(image);
		}
	});
};
const addSavedImage = (req, res) => {
	try {
		const { user_id, image_url, image_id } = req.body;
		const newSavedImage = new savedImage({
			user_id,
            image_url,
            image_id,
		});
		newSavedImage.save((err, savedImage) => {
			if (err) {
				res.status(500).json({
					message: "Error while saving image",
					error: err,
				});
			} else {
				res.status(201).json({
					message: "Image saved successfully",
					savedImage,
				});
			}
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while saving image",
			error,
		});
	}
};
const deleteSavedImage = (req, res) => {
	let image_id = req.query.id;
	console.log(image_id);
	savedImage.findOneAndDelete({ image_id: image_id }, (err, savedImage) => {
		if (err) {
			res.status(500).json({
				message: "Error while deleting image",
				error: err,
			});
		} else {
			res.status(200).json({
				message: "Image deleted successfully",
				savedImage,
			});
		}
	});
};

module.exports = {
	getSavedImage,
	addSavedImage,
	deleteSavedImage,
};
