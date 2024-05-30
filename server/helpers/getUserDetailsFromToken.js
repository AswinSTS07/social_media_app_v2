const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);
  console.log("DECODE -----------", decode);
  const user = await UserModel.findById(decode.id).select("-password");

  return user;
};

module.exports = getUserDetailsFromToken;
