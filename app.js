const express = require("express");
const connectToDB = require("./database/mongodb");
const userRoute = require("./routes/user.route");
const facebookAuthRoute = require("./routes/facebookAuth.route");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3001;
app.use(cors());
app.use("/users", userRoute);
app.get("/", (req, res) => {
	res.send("Backend is running");
});
app.use("/auth/facebook", facebookAuthRoute);
app.listen(port, () => {
	new connectToDB();
	console.log(`Server is running on port ${port}`);
});
