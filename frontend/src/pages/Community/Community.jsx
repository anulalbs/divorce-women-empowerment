import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import CommentThread from "./CommentThread";
import "./CommunityPage.scss";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("/community");
    const enriched = await Promise.all(
      res.data.map(async (p) => {
        const comments = await axios.get(`/comments/${p._id}`);
        return { ...p, comments: comments.data };
      })
    );
    setPosts(enriched);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/community", {
      title: form.title,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()),
    });
    setForm({ title: "", content: "", tags: "" });
    fetchPosts();
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;
    await axios.post("/comments", { post: postId, content });
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-start">Community Discussions</h2>

      {/* New Post Form */}
      <form onSubmit={handleSubmit} className="card p-3 mb-5 shadow-sm">
        <input
          type="text"
          placeholder="Title"
          className="form-control mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Write your post..."
          className="form-control mb-2"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="form-control mb-3"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button className="btn btn-primary" type="submit">
          Post
        </button>
      </form>

      {/* Posts with Comments */}
      {posts.map((p) => (
        <div key={p._id} className="card mb-4 p-3 shadow-sm">
          <h5>{p.title}</h5>
          <p>{p.content}</p>
          <hr />

          {/* Top-level comment input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              className="form-control mb-2"
              value={commentInputs[p._id] || ""}
              onChange={(e) => handleCommentChange(p._id, e.target.value)}
            />
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleCommentSubmit(p._id)}
            >
              Comment
            </button>
          </div>

          {/* Threaded Comments */}
          <CommentThread
            postId={p._id}
            comments={p.comments}
            onCommentAdded={fetchPosts}
          />
        </div>
      ))}
    </div>
  );
};

export default CommunityPage;
