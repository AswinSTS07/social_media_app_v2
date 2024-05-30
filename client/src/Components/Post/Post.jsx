import React, { useState } from "react";
import "./Post.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import axios from "axios";
import { BASE_URL } from "../../constant";
import CommentModal from "../CommentModal/CommentModal";
import { formatDistanceToNow } from "date-fns";

function Post({ user, time, content, image, avatar, name, postId }) {
  const [likes, setLikes] = useState(user.likes);
  const [comments, setComments] = useState(user.comment);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(user.likes.includes(user?.userId));
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleLike = async () => {
    try {
      let res = await axios.put(`${BASE_URL}/api/v1/user/${postId}/like`, {
        userId: user?.userId,
      });
      setLikes(res.data.likes);
      setLiked(!liked);
    } catch (error) {
      console.log("Error while liking post: ", error);
    }
  };

  const handleComment = async () => {
    try {
      let currentUser = JSON.parse(localStorage.getItem("userInfo"));
      let res = await axios.post(`${BASE_URL}/api/v1/user/${postId}/comment`, {
        userId: currentUser?.id,
        text: commentText,
      });
      setComments(res.data.comments);
      setCommentText("");
      toast.success("Your comment posted successfully!");
    } catch (error) {
      console.log("Error while commenting on post: ", error);
    }
  };

  const openModal = () => {
    fetchComments();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchComments = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/v1/user/${postId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.log("Error while fetching comments: ", error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="user-avatar">
          <img
            src={user.profileImage || avatar}
            alt={`${user.name}'s avatar`}
          />
        </div>
        <div className="user-info">
          <a
            href={`/user/${user?.userId}`}
            style={{ textDecoration: "none", color: "#111" }}
          >
            <span className="user-name">{user?.username || name}</span>
          </a>
          <span className="post-time">
            {formatDistanceToNow(new Date(user?.createdAt))} ago
          </span>
        </div>
      </div>
      <div className="post-content">
        <p>{content}</p>
        {image && <img src={image} alt="Post content" className="w-100" />}
      </div>
      <div className="post-actions">
        <button className="action-button" onClick={handleLike}>
          {liked ? (
            <FavoriteIcon className="liked-icon" />
          ) : (
            <FavoriteBorderIcon />
          )}
          <span className="like-count">{likes.length}</span>
        </button>

        <button className="action-button" onClick={openModal}>
          <ChatBubbleOutlineIcon />
          <span className="like-count">{comments?.length}</span>
        </button>
        <button className="action-button">
          <BookmarkBorderIcon />
        </button>
      </div>
      <div className="post-comments">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleComment} className="mt-2">
          Comment
        </button>
      </div>
      <CommentModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        comments={comments}
      />
      <ToastContainer />
    </div>
  );
}

export default Post;
