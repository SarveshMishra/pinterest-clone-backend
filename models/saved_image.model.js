const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedImage = new Schema({
    user_id: { type: String, required: true },
    image_url: { type: String, required: true },
    image_id: { type: String, required: true },
});

module.exports = mongoose.model("savedImage", savedImage);
