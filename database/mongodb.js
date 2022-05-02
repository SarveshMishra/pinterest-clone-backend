require("dotenv").config();
const mongoose = require("mongoose");

class Mongodb {
	constructor() {
		this.createConnection();
	}
	createConnection() {
		mongoose.connect(process.env.MONGODB_ATLAS_URI);
		mongoose.connection.on(
			"error",
			console.error.bind(console, "connection error:")
		);
		mongoose.connection.once("open", () => {
			console.log("MongoDB connected");
		});
	}
}

module.exports = Mongodb;
