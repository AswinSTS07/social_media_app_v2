const mongoose = require("mongoose");

const followingModel = new mongoose.Schema({
  userId: { type: String, required: true },
  following: [],
  followers: [],
});

const Follow = mongoose.model("Follow", followingModel);
module.exports = Follow;
