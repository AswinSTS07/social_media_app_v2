const express = require("express");
const {
  register,
  login,
  getAllPost,
  searchUser,
  getUserDetails,
  checkFollowed,
  sendFollowRequest,
  unFollow,
  getFollowing,
  getRecommendedUsers,
} = require("../controller/userController");
const Post = require("../models/postModel");
const { post } = require("../data");
const { cloudinary } = require("../utils/cloudinary");
const UserModel = require("../models/UserModel");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("user router called....");
});

userRouter.post("/login", async (req, res) => {
  let userData = req.body;
  await login(userData, res).then((result) => {
    res.send(result);
  });
});

userRouter.post("/register", async (req, res) => {
  let userData = req.body;
  await register(userData).then((result) => {
    res.send(result);
  });
});

userRouter.get("/posts/:id", async (req, res) => {
  let userId = req.params.id;
  await getAllPost(userId).then((result) => {
    res.send(result);
  });
});

const uploadImage = async (src) => {
  try {
    const fileStr = src;
    if (src && fileStr) {
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "cloudinary_react",
        public_id: Date.now(),
      });
      if (uploadResponse && uploadResponse.url) {
        return uploadResponse.url;
      } else {
        throw new Error("Failed to upload image");
      }
    }
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};

userRouter.post("/upload-cover-photo/:id", async (req, res) => {
  try {
    const fileStr = req.body.src;
    let user = await UserModel.findOne({ _id: req.params.id });
    const uploadResponse = await cloudinary.uploader
      .upload(fileStr, {
        upload_preset: "cloudinary_react",
        public_id: Date.now(),
      })
      .then(async (response) => {
        if (response && response.url) {
          let postData = {
            userId: req.params.id,
            caption: req.body.caption,
            type: "image",
            src: req.body.src,
            category: "photography",
            profileImage: user?.profileImage,
            username: user?.username,
          };
          await Post.create(postData);
          res.status(200).json({ message: "Cover photo uploaded" });
        } else {
          res.status(400);
        }
      });
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

userRouter.get("/search", async (req, res) => {
  let query = req.query;

  await searchUser(query).then((result) => {
    res.send(result);
  });
});

userRouter.get("/user/:id", async (req, res) => {
  await getUserDetails(req.params.id).then((result) => {
    res.send(result);
  });
});

userRouter.post("/edit-profile/:id", async (req, res) => {
  try {
    const coverSrc = await uploadImage(req.body?.coverPhoto);
    const profileSrc = await uploadImage(req.body?.profile);
    delete req.body.coverPhoto;
    delete req.body.profile;

    req.body.profileImage = profileSrc;
    req.body.coverImage = coverSrc;

    const result = await UserModel.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    res.status(200).json({ message: "Profile updated successfully", coverSrc });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
});

userRouter.post("/check-followed", async (req, res) => {
  await checkFollowed(req.body.fromId, req.body.toId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/send-follow-request", async (req, res) => {
  await sendFollowRequest(req.body.fromId, req.body.toId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/unfollow", async (req, res) => {
  await unFollow(req.body.fromId, req.body.toId).then((result) => {
    res.send(result);
  });
});

userRouter.get("/following/:id", async (req, res) => {
  await getFollowing(req.params.id).then((result) => {
    res.send(result);
  });
});

userRouter.put("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    console.log("req body userId : ", req.body.userId);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
    } else {
      post.likes.pull(req.body.userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRouter.post("/:postId/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const user = await UserModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      userId: req.body.userId,
      text: req.body.text,
      username: user.username,
      profileImage: user.profileImage,
    };
    console.log("new comment : ", newComment);
    post.comment.push(newComment);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRouter.get("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "comment.userId",
      "username profileImage"
    );
    res.status(200).json(post.comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRouter.get("/recommended-users/:id", async (req, res) => {
  await getRecommendedUsers(req.params.id).then((result) => {
    res.send(result);
  });
});

userRouter.get("/my-post/:id", async (req, res) => {
  let data = await Post.find({ userId: req.params.id });
  res.send(data);
});

module.exports = userRouter;
