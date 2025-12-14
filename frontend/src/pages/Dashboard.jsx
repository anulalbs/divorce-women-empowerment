import React, { useEffect, useState } from "react";
import { FaUsers, FaNewspaper } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { SiCodementor } from "react-icons/si";

import axiosClient from "../api/axiosClient";
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ users: null, blogs: null, posts: null, experts: null });
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [usersRes, blogsRes, postsRes, expertsRes] = await Promise.all([
          axiosClient.get("/users"),
          axiosClient.get("/blogs"),
          axiosClient.get("/community"),
          axiosClient.get("/users/experts"),
        ]);

        setCounts({
          users: usersRes?.data ? usersRes.data.total : null,
          blogs: Array.isArray(blogsRes.data) ? blogsRes.data.length : null,
          posts: Array.isArray(postsRes.data) ? postsRes.data.length : null,
          experts: expertsRes?.data ? expertsRes.data.total : null
        });
      } catch (err) {
        console.warn("Dashboard: partial failure fetching counts", err?.response || err?.message);
        setError(err?.response?.data?.message || err?.message || "Failed to fetch some data");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    // fetch recent activities (latest users, blogs, posts)
    const fetchActivities = async () => {
      try {
        const [usersRes, blogsRes, postsRes, loginsRes] = await Promise.all([
          axiosClient.get("/users?page=1&limit=5"),
          axiosClient.get("/blogs"),
          axiosClient.get("/community"),
          axiosClient.get("/users/recent-logins?limit=5"),
        ]);

        // normalize users list (paginated response vs array)
        const usersList = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.users || [];

        const recentUsers = (usersList || []).slice(0, 5).map((u) => ({
          id: u._id,
          type: "registration",
          title: u.fullname || u.email,
          subtitle: u.email,
          date: u.createdDate || u.createdAt || u.created || u.created_on,
        }));

        const recentBlogs = (Array.isArray(blogsRes.data) ? blogsRes.data : []).slice(0, 5).map((b) => ({
          id: b._id,
          type: "blog",
          title: b.title,
          subtitle: b.author?.fullname || b.author?.email,
          date: b.createdAt,
        }));

        const recentPosts = (Array.isArray(postsRes.data) ? postsRes.data : []).slice(0, 5).map((p) => ({
          id: p._id,
          type: "post",
          title: p.title,
          subtitle: p.author?.fullname || p.author?.email,
          date: p.createdAt,
        }));

          const recentLogins = (Array.isArray(loginsRes.data) ? loginsRes.data : []).slice(0, 5).map((l) => ({
            id: l._id || l.email,
            type: "login",
            title: l.fullname || l.email,
            subtitle: l.email,
            date: l.lastLogin,
          }));

        // merge and sort by date desc, limit to 10
        const merged = [...recentUsers, ...recentLogins, ...recentBlogs, ...recentPosts]
          .filter(Boolean)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10);

        setActivities(merged);
      } catch (err) {
        console.warn("Failed to fetch recent activities", err?.response || err?.message);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-start">Dashboard</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0">Users</h6>
                  <strong style={{ fontSize: 24 }}>{counts.users ?? "—"}</strong>
                </div>
                <FaUsers style={{ fontSize: 28, color: '#0d6efd' }} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0">Blogs</h6>
                  <strong style={{ fontSize: 24 }}>{counts.blogs ?? "—"}</strong>
                </div>
                <FaNewspaper style={{ fontSize: 28, color: '#198754' }} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0">Community Posts</h6>
                  <strong style={{ fontSize: 24 }}>{counts.posts ?? "—"}</strong>
                </div>
                <MdForum style={{ fontSize: 28, color: '#fd7e14' }} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0">Experts</h6>
                  <strong style={{ fontSize: 24 }}>{counts.experts ?? "—"}</strong>
                </div>
                <SiCodementor style={{ fontSize: 28, color: '#6f42c1' }} />
              </div>
            </div>
          </div>

          {error && (
            <div className="col-12 mt-3">
              <div className="alert alert-warning">{error}</div>
            </div>
          )}
        </div>
      )}

      {/* Recent activity section */}
      <div className="mt-4">
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">Recent activity</h5>
          {activities.length === 0 ? (
            <div className="text-muted">No recent activity</div>
          ) : (
            <ul className="list-unstyled mb-0">
              {activities.map((a) => (
                <li key={a.type + a.id} className="d-flex justify-content-between align-items-start py-2 border-bottom">
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <small className="text-muted">{a.subtitle}</small>
                  </div>
                  <div className="text-end text-muted small">
                    <div>{new Date(a.date).toLocaleString()}</div>
                    <div className="badge bg-light text-dark mt-1">{a.type}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
