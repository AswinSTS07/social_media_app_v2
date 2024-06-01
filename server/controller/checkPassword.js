const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function checkPassword(request, response) {
  try {
    const { password, email } = request.body;

    const user = await UserModel.findOne({ email });

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return response.status(400).json({
        message: "Please check password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(
      tokenData,
      process.env.JWT_SECREAT_KEY || "something_secret",
      {
        expiresIn: "30d",
      }
    );

    const cookieOptions = {
      http: true,
      secure: true,
    };

    return response.status(200).json({
      message: "Login successfully",
      token: token,
      success: true,
      data: user,
    });

    // return response.cookie("token", token, cookieOptions).status(200).json({
    //   message: "Login successfully",
    //   token: token,
    //   success: true,
    //   data: user,
    // });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
