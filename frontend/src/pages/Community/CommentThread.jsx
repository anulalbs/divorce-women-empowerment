import React, { useState } from "react";
import axios from "../../api/axiosClient";

const CommentThread = ({ postId, comments = [], onCommentAdded }) => {
  const [replyInputs, setReplyInputs] = useState({});

  const handleReplyChange = (id, value) =>
    setReplyInputs((prev) => ({ ...prev, [id]: value }));

  const handleReplySubmit = async (parentComment) => {
    const content = replyInputs[parentComment];
    if (!content?.trim()) return;
    await axios.post("/comments", { post: postId, content, parentComment });
    setReplyInputs((prev) => ({ ...prev, [parentComment]: "" }));
    onCommentAdded();
  };

  const toggleLike = async (commentId) => {
    await axios.post(`/comments/${commentId}/like`);
    onCommentAdded();
  };

  return (
    <div className="comment-thread">
      {comments.map((c) => (
        <div key={c._id} className="comment-box border rounded p-2 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <strong>{c.author?.fullname}</strong>
            <small className="text-muted">
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>

          <p className="mb-2">{c.content}</p>

          <div className="d-flex gap-3 align-items-center small text-muted">
            <span>💬 {c.replyCount || 0}</span>
            <span
              className="like-btn"
              role="button"
              onClick={() => toggleLike(c._id)}
            >
              ❤️ {c.likeCount || 0}
            </span>
          </div>

          <div className="mt-2">
            <input
              type="text"
              placeholder="Write a reply..."
              className="form-control form-control-sm"
              value={replyInputs[c._id] || ""}
              onChange={(e) => handleReplyChange(c._id, e.target.value)}
            />
            <button
              className="btn btn-outline-primary btn-sm mt-1"
              onClick={() => handleReplySubmit(c._id)}
            >
              Reply
            </button>
          </div>

          {c.replies?.length > 0 && (
            <div className="ms-4 mt-2 border-start ps-3">
              <CommentThread
                postId={postId}
                comments={c.replies}
                onCommentAdded={onCommentAdded}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentThread;
