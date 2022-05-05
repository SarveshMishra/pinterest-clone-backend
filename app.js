const express = require("express");
const connectToDB = require("./database/mongodb");
const userRoute = require("./routes/user.route");
const facebookAuthRoute = require("./routes/facebookAuth.route");
const savedImageRoute = require("./routes/savedImage.route");
const googleAuthRoute = require("./routes/googleAuth.route");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.use("/users", userRoute);
app.get("/", (req, res) => {
	res.send("Backend is running");
});
app.use("/auth/facebook", facebookAuthRoute);
app.use("/auth/google", googleAuthRoute);
app.use("/save", savedImageRoute);
app.listen(port, () => {
	new connectToDB();
	console.log(`Server is running on port ${port}`);
});
