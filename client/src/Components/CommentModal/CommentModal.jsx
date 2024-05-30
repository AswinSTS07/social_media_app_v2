import React from "react";
import Modal from "react-modal";
import "./CommentModal.css";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";

Modal.setAppElement("#root");

function CommentModal({ isOpen, onRequestClose, comments }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="comment-modal"
      overlayClassName="comment-modal-overlay"
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2
          style={{
            fontSize: "20px",
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        >
          Comments
        </h2>
        <button onClick={onRequestClose} className="close-button">
          <CloseIcon />
        </button>
      </div>
      <div className="comments-container">
        {comments?.length == 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h6>No comments</h6>
          </div>
        ) : (
          comments?.map((comment, index) => (
            <div key={index} className="comment">
              <img
                src={comment.profileImage}
                alt="Profile"
                className="comment-avatar"
              />
              <div style={{ marginLeft: "20px" }}>
                <span className="comment-user">{comment.username}</span>
                <p className="comment-text">{comment.text}</p>
              </div>
              <span
                style={{
                  color: "gray",
                  fontWeight: "500",
                  fontFamily: "sans-serif",
                  fontSize: "12px",
                  marginLeft: "20px",
                }}
              >
                {formatDistanceToNow(new Date(comment?.createdAt))} ago
              </span>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

export default CommentModal;
