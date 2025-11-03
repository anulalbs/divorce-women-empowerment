import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./Blog.scss";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axiosClient.get(`/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <>
    <h2 className="text-start">{blog.title}</h2>
    <div className="blog-detail">
      <p className="author">By {blog.author.fullname}</p>
      <div className="content">{blog.content}</div>
      {blog.tags?.length > 0 && (
        <div className="tags">
          <h4>Tags:</h4>
          {blog.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      )}
    </div>
    </>
  );
}
