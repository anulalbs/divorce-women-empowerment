import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function AdminReportsModal({ expert, onClose, onUpdated }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/reports/expert/${expert._id || expert.id}`);
        if (!mounted) return;
        setReports(res.data.reports || []);
      } catch (err) {
        console.error('Failed to load reports', err);
        setError('Failed to load reports');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [expert]);

  const closeReport = async (reportId) => {
    await updateReportStatus(reportId, 'closed');
  };

  const markInProgress = async (reportId) => {
    //if (!confirm('Mark this report as In-Progress? This will set the expert as inactive.')) return;
    await updateReportStatus(reportId, 'in-progress');
  };

  const updateReportStatus = async (reportId, newStatus) => {
    setUpdating(reportId);
    try {
      const res = await axiosClient.patch(`/reports/${reportId}`, { status: newStatus });
      setReports((prev) => prev.map(r => r._id === reportId ? res.data.report : r));
      // notify parent that a report (and possibly expert state) changed
      try {
        if (onUpdated) onUpdated({ expertId: expert._id || expert.id, reportId, status: newStatus });
      } catch (cbErr) {
        console.warn('onUpdated callback failed', cbErr);
      }
    } catch (err) {
      console.error(`Failed to update report status to ${newStatus}`, err);
      alert(`Failed to update report status to ${newStatus}`);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5>Reports for {expert.fullname}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Close</button>
        </div>
        <hr />
        {loading && <div>Loading reports...</div>}
        {error && <div className="text-danger">{error}</div>}
        {!loading && !error && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {reports.length === 0 && <div>No reports found for this expert.</div>}
            {reports.map((r) => (
              <div key={r._id} className="card mb-2 p-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div><strong>By:</strong> {r.userId?.fullname || r.userId?.email || 'Unknown'}</div>
                    <div className="text-muted small">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{r.status}</div>
                    <div>
                      {r.status !== 'in-progress' && (
                        <button className="btn btn-sm btn-warning mt-2 me-2" onClick={() => markInProgress(r._id)} disabled={updating === r._id}>
                          {updating === r._id && r.status !== 'in-progress' ? 'Updating...' : 'Mark In-Progress'}
                        </button>
                      )}
                      <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => closeReport(r._id)} disabled={updating === r._id || r.status === 'closed'}>
                        {updating === r._id ? 'Updating...' : (r.status === 'closed' ? 'Closed' : 'Close report')}
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
                <div>{r.comment}</div>
              </div>
            ))}
          </div>
        )}
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
  width: 'min(900px, 95%)',
  borderRadius: 8,
  boxShadow: '0 6px 24px rgba(0,0,0,0.2)'
};
