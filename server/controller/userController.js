const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../constants");
const Post = require("../models/postModel");
const Follow = require("../models/followingModel");
const UserModel = require("../models/UserModel");
const { io } = require("../socket");
const JWT_SECRET = process.env.JWT_SECRET || "something_secret";

module.exports = {
  register: (userData) => {
    return new Promise(async (resolve, reject) => {
      let { username, email } = userData;
      username = await UserModel.findOne({ username });
      email = await UserModel.findOne({ email });
      if (username || email) {
        errorResponse.message =
          "User already exists with this usename or email";
        resolve(errorResponse);
      } else {
        let bcryptedPassword = await bcrypt.hash(userData.password, 10);

        userData.password = bcryptedPassword;
        const token = jwt.sign({ username, email }, JWT_SECRET, {
          expiresIn: "2h",
        });
        userData.token = token;

        await UserModel.create(userData).then((result) => {
          if (result) {
            successResponse.data = result;
            resolve(successResponse);
          } else {
            resolve(errorResponse);
          }
        });
      }
    });
  },
  login: (userData, response) => {
    return new Promise(async (resolve, reject) => {
      const { email, password } = userData;

      const user = await UserModel.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, email }, JWT_SECRET, {
          expiresIn: "2h",
        });

        user.token = token;
        const cookieOptions = {
          http: true,
          secure: true,
        };
        resolve(
          response.cookie("token", token, cookieOptions).status(200).json({
            message: "Login successfully",
            token: token,
            success: true,
            data: user,
          })
        );
        // successResponse.data = user;
        // resolve(successResponse);
      }
      resolve(errorResponse);
    });
  },
  getAllPost: (userId) => {
    return new Promise(async (resolve, reject) => {
      const user = await UserModel.findOne({ _id: userId });
      let post = [];
      if (user) {
        let user_interest = user?.interests;
        if (user_interest.length == 0) {
          post = await Post.find();
        } else {
          const query = { category: { $in: user_interest } };
          post = await Post.find(query);
        }
        successResponse.data = post;
        resolve(successResponse);
      }
    });
  },
  searchUser: (query) => {
    return new Promise(async (resolve, reject) => {
      const users = await UserModel.find({
        username: { $regex: query?.username, $options: "i" },
      });
      successResponse.data = users;
      resolve(successResponse);
    });
  },
  getUserDetails: (userId) => {
    return new Promise(async (resolve, reject) => {
      let user = await UserModel.findOne({ _id: userId });
      if (user) {
        successResponse.data = user;
        resolve(successResponse);
      } else {
        errorResponse.message = "User not found";
        resolve(errorResponse);
      }
    });
  },
  checkFollowed: (fromId, toId) => {
    return new Promise(async (resolve, reject) => {
      UserModel.findOne({ _id: fromId }).then(async (fromUser) => {
        let followingCount = fromUser?.following;

        if (followingCount == 0) {
          resolve(false);
        } else {
          let check = await Follow.findOne({ userId: fromId });

          if (check) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  },
  sendFollowRequest: (fromId, toId) => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ _id: fromId }).then(async (fromUser) => {
        let followingCount = fromUser?.following;
        let private = false;
        let toUser = await UserModel.findOne({ _id: toId }, { private: 1 });
        private = toUser?.private;

        if (private) {
          // Send notification to user
          io.to(toId).emit("notification", {
            message: `${fromUser.username} has sent you a follow request.`,
            fromUserId: fromId,
          });
          resolve({ success: true, private: true });
        } else {
          let userFollowDetails = await Follow.findOne({ userId: fromId });

          if (followingCount == 0 || userFollowDetails == null) {
            let new_data = {
              userId: fromId,
              following: [toId],
            };
            await Follow.create(new_data);
            await UserModel.updateOne(
              { _id: fromId },
              { $set: { following: followingCount + 1 } }
            );
            io.to(toId).emit("notification", {
              message: `${fromUser.username} has started following you.`,
              fromUserId: fromId,
            });
            resolve(true);
          } else {
            const result = await Follow.updateOne(
              { userId: fromId },
              { $push: { following: toId } },
              { new: true, useFindAndModify: false }
            );
            if (result?.modifiedCount == 1) {
              io.to(toId).emit("notification", {
                message: `${fromUser.username} has started following you.`,
                fromUserId: fromId,
              });
              resolve(true);
            }
          }
        }
      });
    });
  },
  unFollow: (fromId, toId) => {
    return new Promise(async (resolve, reject) => {
      let user = await UserModel.findOne({ _id: fromId });
      let followingCount = user?.following;
      await Follow.updateOne(
        { userId: fromId },
        { $pull: { following: toId } },
        { new: true, useFindAndModify: false }
      );
      await UserModel.updateOne(
        { _id: fromId },
        { following: followingCount - 1 }
      );
      resolve(true);
    });
  },
  getFollowing: (id) => {
    return new Promise(async (resolve, reject) => {
      const followDoc = await Follow.findOne({ userId: id });
      if (followDoc) {
        const followingIds = followDoc.following;

        const users = await UserModel.find(
          { _id: { $in: followingIds } },
          "_id profileImage username bio"
        );
        successResponse.data = users;
        resolve(successResponse);
      } else {
        return [];
      }
    });
  },
  getRecommendedUsers: (id) => {
    return new Promise(async (resolve, reject) => {
      let user = await UserModel.findOne({ _id: id });
      let recommended_users = [];
      if (user?.interests?.length == 0) {
        recommended_users = await UserModel.find({ _id: { $ne: id } });
      }
      successResponse.data = recommended_users;
      resolve(successResponse);
    });
  },
};
