import React, { useState } from "react";
import axios from "../../api/axiosClient";
import { useSelector } from "react-redux";

const CommentThread = ({ postId, comments = [], onCommentAdded, postAuthor }) => {
  const [replyInputs, setReplyInputs] = useState({});
  const [editing, setEditing] = useState(null); // comment id being edited
  const [editInputs, setEditInputs] = useState({});
  const { profile } = useSelector((state) => state.user);

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

  const startEdit = (comment) => {
    setEditing(comment._id);
    setEditInputs((prev) => ({ ...prev, [comment._id]: comment.content }));
  };

  const cancelEdit = (commentId) => {
    setEditing(null);
    setEditInputs((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleEditChange = (id, value) =>
    setEditInputs((prev) => ({ ...prev, [id]: value }));

  const submitEdit = async (commentId) => {
    const content = editInputs[commentId];
    if (!content?.trim()) return;
    try {
      await axios.patch(`/comments/${commentId}`, { content });
      setEditing(null);
      setEditInputs((prev) => ({ ...prev, [commentId]: "" }));
      onCommentAdded();
    } catch (err) {
      console.error("Error updating comment", err?.response || err.message);
    }
  };

  const deleteComment = async (commentId) => {
    const ok = window.confirm("Delete this comment and all its replies?");
    if (!ok) return;
    try {
      await axios.delete(`/comments/${commentId}`);
      onCommentAdded();
    } catch (err) {
      console.error("Error deleting comment", err?.response || err.message);
    }
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

          {editing === c._id ? (
            <div>
              <textarea
                className="form-control"
                value={editInputs[c._id] || ""}
                onChange={(e) => handleEditChange(c._id, e.target.value)}
              />
              <div className="mt-2">
                <button className="btn btn-primary btn-sm me-2" onClick={() => submitEdit(c._id)}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => cancelEdit(c._id)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
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
                {/* show edit button for comment author */}
                {profile && (String(profile._id) === String(c.author?._id) || profile.role === "admin") && (
                  <span className="ms-2 text-primary" role="button" onClick={() => startEdit(c)}>
                    Edit
                  </span>
                )}
                {/* Delete allowed for post author, comment author, or admin */}
                {profile && (String(profile._id) === String(postAuthor) || String(profile._id) === String(c.author?._id) || profile.role === "admin") && (
                  <span className="ms-2 text-danger" role="button" onClick={() => deleteComment(c._id)}>
                    Delete
                  </span>
                )}
          </div>
            </>
          )}

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
