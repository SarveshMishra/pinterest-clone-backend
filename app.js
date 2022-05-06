const express = require("express");
const connectToDB = require("./database/mongodb");
const userRoute = require("./routes/user.route");
const facebookAuthRoute = require("./routes/facebookAuth.route");
const savedImageRoute = require("./routes/savedImage.route");
const googleAuthRoute = require("./routes/googleAuth.route");
const app = express();
const cors = require("cors");

app.use(cors());
const port = process.env.PORT || 3000;
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
