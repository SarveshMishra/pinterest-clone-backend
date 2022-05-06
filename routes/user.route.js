const express = require("express");
const user = express.Router();
const cors = require("cors");
const tokenVerifier = require("../middleware/tokenVerifier");
const isTokenActive = require("../middleware/isTokenActive");
user.use(cors());
const userController = require("../controllers/user.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
user.use(express.json());
user.get("/", userController.fetchAllUsers);
user.post("/", userController.createUser);
user.get(
	"/getUser",
	isTokenActive,
	tokenVerifier,
	userController.fetchUserById
);
user.post("/:id/avatar", upload.single("image"), userController.uploadAvatar);
user.get("/:id/avatar/:key", userController.downloadAvatar);
user.post("/login", userController.login);
user.patch("/", userController.updateUser);
user.delete("/signout", tokenVerifier, userController.signOut);
module.exports = user;
