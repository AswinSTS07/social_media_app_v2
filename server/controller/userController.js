const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../constants");
const Post = require("../models/postModel");
const Follow = require("../models/followingModel");
const UserModel = require("../models/UserModel");
const { io } = require("../socket");
const Notification = require("../models/NotificationModel");
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
          let followData = await Follow.findOne({ userId: fromId });

          if (followData && followData?.following.length > 0) {
            let exists = followData.following.includes(toId);
            if (exists) {
              resolve(true);
            } else {
              resolve(false);
            }
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
        let toUser = await UserModel.findOne(
          { _id: toId },
          { private: 1, followers: 1 }
        );
        private = toUser?.private;
        let not_data = {
          userId: fromId,
          message: `${fromUser.username} has sent you a follow request.`,
          read: false,
          private,
        };
        if (private) {
          // Send notification to user
          io.to(toId).emit("notification", {
            message: `${fromUser.username} has sent you a follow request.`,
            fromUserId: fromId,
          });
          resolve({ success: true, private: true });
        } else {
          let userFollowDetails = await Follow.findOne({ userId: fromId });

          if (followingCount < 1 || userFollowDetails == null) {
            let new_data = {
              userId: fromId,
              following: [toId],
            };
            await Follow.create(new_data);

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
          await Notification.create(not_data);

          let followersCount = toUser.followers;
          if (followersCount < 0) {
            followersCount = 0;
          }
          let follow_ = await Follow.findOne({ userId: toId });
          if (follow_) {
            followersCount = follow_.followers.length;
            const result_ = await Follow.updateOne(
              { userId: toId },
              { $push: { followers: fromId } },
              { new: true, useFindAndModify: false }
            );
          } else {
            let new_data = {
              userId: toId,
              followers: [fromId],
            };

            await Follow.create(new_data);
            followersCount += 1;
            await UserModel.updateOne(
              { _id: toId },
              { $set: { followers: followersCount } }
            );
          }
        }
      });
    });
  },
  unFollow: (fromId, toId) => {
    return new Promise(async (resolve, reject) => {
      let user = await UserModel.findOne({ _id: fromId });
      let followingCount = user?.following;
      let followersCount = user?.followers;
      await Follow.updateOne(
        { userId: fromId },
        { $pull: { following: toId } },
        { new: true, useFindAndModify: false }
      );
      await UserModel.updateOne(
        { _id: fromId },
        { following: followingCount - 1 }
      );
      if (followersCount == 1) {
        await UserModel.updateOne({ _id: toId }, { followers: 0 });
      } else {
        await UserModel.updateOne(
          { _id: toId },
          { followers: followersCount - 1 }
        );
      }

      resolve(true);
    });
  },
  getFollowing: (id, limit = 5, skip = 0) => {
    return new Promise(async (resolve, reject) => {
      try {
        const followDoc = await Follow.findOne({ userId: id });

        if (followDoc) {
          const followingIds = followDoc.following;

          const users = await UserModel.find(
            { _id: { $in: followingIds } },
            "_id profileImage username bio"
          );

          resolve({
            success: true,
            data: users,
          });
        } else {
          resolve({
            success: true,
            data: [],
          });
        }
      } catch (error) {
        reject({
          success: false,
          message: error.message,
        });
      }
    });
  },
  getFollowers: (id, limit = 5, skip = 0) => {
    return new Promise(async (resolve, reject) => {
      try {
        const followDoc = await Follow.findOne({ userId: id });

        if (followDoc) {
          const followingIds = followDoc.followers;

          const users = await UserModel.find(
            { _id: { $in: followingIds } },
            "_id profileImage username bio"
          );

          resolve({
            success: true,
            data: users,
          });
        } else {
          resolve({
            success: true,
            data: [],
          });
        }
      } catch (error) {
        reject({
          success: false,
          message: error.message,
        });
      }
    });
  },
  getRecommendedUsers: (id, page, limit) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await UserModel.findOne({ _id: id });
        let recommended_users = [];
        const skip = (page - 1) * limit;

        if (user?.interests?.length === 0) {
          recommended_users = await UserModel.find(
            { _id: { $ne: id } },
            { _id: 1, username: 1, profile_pic: 1, followers: 1, bio: 1 }
          )
            .skip(skip)
            .limit(limit);
        }

        const totalUsers = await UserModel.countDocuments({ _id: { $ne: id } });
        const totalPages = Math.ceil(totalUsers / limit);

        successResponse.data = {
          users: recommended_users,
          totalUsers,
          totalPages,
        };

        resolve(successResponse);
      } catch (error) {
        reject(error);
      }
    });
  },
  getNotifications: (id) => {
    return new Promise((resolve, reject) => {
      Notification.find({ userId: id }).then((result) => {
        resolve(result);
      });
    });
  },
};
