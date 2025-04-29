const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const placeSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  createdUserID: { type: String, ref: "User", required: true },
  placeName: { type: String, required: true },
  placeImgUrl: { type: String, required: true },
  placeDescription: { type: String, required: true },
  placeAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Place", placeSchema);
