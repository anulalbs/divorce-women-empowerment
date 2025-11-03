import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useSelector } from "react-redux";
import "./Blog.scss";

export default function BlogList() {
  const { isLoggedIn } = useSelector((state) => state.user);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axiosClient.get("/blogs")
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-start w-50">Blogs</h2>
        {isLoggedIn && <a href="/blogs/create" className="btn btn-primary">Create</a>}
      </div>

      <div className="blog-list">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <h3><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></h3>
            <p className="author">By {blog.author.fullname}</p>
            <p>{blog.content.substring(0, 200)}...</p>
            <Link to={`/blogs/${blog._id}`} className="read-more">Read More...</Link>
          </div>
        ))}
      </div>
    </>
  );
}
