const express = require("express");
const user = express.Router();
const userController = require("../controllers/user.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

user.use(express.json());

user.get("/", userController.fetchAllUsers);
user.post("/", userController.createUser);
user.get("/:id", userController.fetchUserById);
user.post("/:id/avatar", upload.single("image"), userController.uploadAvatar);
user.get("/:id/avatar/:key", userController.downloadAvatar);

module.exports = user;
