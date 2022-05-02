const express = require("express");
const connectToDB = require("./database/mongodb");
const userRoute = require("./routes/user.route");

const app = express();

const port = process.env.PORT || 3000;

app.use("/users", userRoute);
app.listen(port, () => {
	new connectToDB();
	console.log("Server is running on port 3000");
});
