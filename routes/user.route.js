const express = require("express");
const user = express.Router();
const userController = require("../controllers/user.controller");
user.use(express.json());

user.get("/", userController.fetchAllUsers);
user.post("/", userController.createUser);
user.get("/:id", userController.fetchUserById);
module.exports = user;
