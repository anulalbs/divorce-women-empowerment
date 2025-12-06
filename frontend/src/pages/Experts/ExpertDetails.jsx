import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function ExpertDetails() {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [reported, setReported] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axiosClient.get("/users/experts");
        if (!mounted) return;
        const found = (res.data.users || []).find((u) => (u._id || u.id) === id);
        setExpert(found || null);
        // check if this expert has active reports
        if (found) {
          try {
            const cr = await axiosClient.get(`/reports/check/${found._id || found.id}`);
            if (!mounted) return;
            setReported(!!cr.data.reported);
          } catch (e) {
            console.warn('Failed to check report status', e);
          }
        }
      } catch (err) {
        console.error("Failed to load expert", err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (!expert) {
    return (
      <div className="container py-4">
        <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>← Back</button>
        <div>Loading expert details...</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {reported && (
        <div className="alert alert-warning" role="alert">
          This expert has been reported by a user and is currently under evaluation by our moderation team. Some actions (chat, report) are disabled until the review completes.
        </div>
      )}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2>{expert.fullname}</h2>
          <div className="text-muted">{expert.location || 'Location not provided'}</div>
        </div>
        <div>
          <Link to="/experts/find" className="btn btn-outline-secondary me-2">Back to list</Link>
          {expert.isActive ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/messages', { state: { selectedExpert: expert } })}
              disabled={reported}
              title={reported ? 'Actions disabled: expert has an active report' : ''}
            >
              Chat
            </button>
          ) : (
            <button className="btn btn-secondary" disabled title="Expert is currently offline">Chat (offline)</button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 mb-3">
            <h5>About</h5>
            <p className="mb-0">{expert.bio || 'Experienced professional available to help.'}</p>
          </div>

          <div className="card p-3 mb-3">
            <h5>Contact</h5>
            <p className="mb-0">Email: {expert.email}</p>
            <p className="mb-0">Phone: {expert.phone || 'Not provided'}</p>
          </div>
        </div>

        <aside className="col-md-4">
          <div className="card p-3">
            <h5>Quick Info</h5>
            <ul className="list-unstyled">
              <li><strong>Role:</strong> {expert.role}</li>
              <li><strong>Active:</strong> {expert.isActive ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
