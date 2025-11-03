import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./Blog.scss";

export default function CreateBlog() {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/blogs", {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      });
      navigate("/blogs");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating blog");
    }
  };

  return (<>
     <h2 className="text-start">Create New Blog</h2>
    <div className="create-blog">
     
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} />
        <textarea name="content" placeholder="Content" rows={10} onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
        <button className="btn btn-primary" type="submit">Publish</button>
      </form>
    </div>
    </>
  );
}
