import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function ReportExpertModal({ expert, onClose, onReported }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Try to POST to /reports if backend supports it; otherwise just log
      await axiosClient.post("/reports", { expertId: expert._id || expert.id, comment });
      setLoading(false);
      if (onReported) onReported();
      onClose();
    } catch (err) {
      console.error("Failed to report expert", err);
      setError("Failed to submit report. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="report-modal-overlay" style={overlayStyle}>
      <div className="report-modal" style={modalStyle} role="dialog" aria-modal="true">
        <h5>Report {expert.fullname}</h5>
        <p className="text-muted">Tell us why you're reporting this expert. Our team will review the report.</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
          placeholder="Describe the issue or concern..."
        />
        {error && <div className="text-danger mb-2">{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle = {
  background: '#fff',
  padding: 20,
  width: 'min(720px, 95%)',
  borderRadius: 8,
  boxShadow: '0 6px 24px rgba(0,0,0,0.2)'
};
