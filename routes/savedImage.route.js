const express = require("express");
const savedImage = express.Router();
const savedImageController = require("../controllers/saved_image.controller");

savedImage.use(express.json());
savedImage.get("/", savedImageController.getSavedImage);
savedImage.post("/", savedImageController.addSavedImage);
savedImage.delete("/", savedImageController.deleteSavedImage);
module.exports = savedImage;
