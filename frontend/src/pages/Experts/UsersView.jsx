import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReportExpertModal from "./ReportExpertModal";

export default function UsersView() {
  const [experts, setExperts] = useState([]);
  const [reportingExpert, setReportingExpert] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((s) => s.user || {});

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axiosClient.get("/users/experts");
        if (!mounted) return;
        const list = res.data.users || [];
        setExperts(list);
        // batch-check reports for loaded experts
        const ids = list.map((x) => x._id || x.id).filter(Boolean);
        if (ids.length) {
          try {
            const r = await axiosClient.get(`/reports/check?expertIds=${ids.join(",")}`);
            const reportedIds = new Set((r.data.reportedIds || []).map(String));
            // mark reported flag on experts locally for UI
            setExperts((prev) => prev.map((ex) => ({ ...ex, _reported: reportedIds.has(String(ex._id || ex.id)) })));
          } catch (e) {
            // non-fatal: just log
            console.warn("Failed to batch-check reports", e);
          }
        }
      } catch (err) {
        console.error("Failed to load experts", err);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const openChat = (expert) => {
    // navigate to messages and set the selected expert via location state
    navigate('/messages', { state: { selectedExpert: expert } });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Find an Expert</h2>
        <p className="text-muted mb-0">Browse verified experts and start a chat.</p>
      </div>

      <div className="row g-3">
        {experts.map((e) => (
          <div className="col-md-4" key={e._id}>
                <div className="card p-3 h-100" style={{ position: 'relative' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <h5 className="mb-1" style={{ margin: 0 }}>{e.fullname}</h5>
                        {e._reported && (
                          <span
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: 12,
                              background: '#d9534f',
                              color: '#fff',
                              padding: '4px 10px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 600,
                              pointerEvents: 'none'
                            }}
                          >
                            Under evaluation
                          </span>
                        )}
                  </div>
                  <small className="text-muted">{e.location || 'Location not provided'}</small>
                </div>
                <div>
                  <small className="text-muted">Expert</small>
                </div>
              </div>
              <p className="text-muted small mb-3">{e.bio || "Experienced professional available to help."}</p>
              <div className="d-flex gap-2 mt-auto">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/experts/${e._id}`)}
                  disabled={!!e._reported}
                  title={e._reported ? 'This expert has an active report and actions are disabled' : ''}
                >
                  View
                </button>
                {e.isActive ? (
                  <button className="btn btn-primary" onClick={() => openChat(e)} disabled={!!e._reported} title={e._reported ? 'Chat disabled due to active report' : ''}>Chat</button>
                ) : (
                  <button className="btn btn-secondary" disabled title="Expert is currently offline">Chat (offline)</button>
                )}
                <button className="btn btn-outline-danger" onClick={() => setReportingExpert(e)} disabled={!!e._reported} title={e._reported ? 'Cannot report while another report is active' : ''}>Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {reportingExpert && (
        <ReportExpertModal
          expert={reportingExpert}
          onClose={() => setReportingExpert(null)}
          onReported={() => { /* optionally show toast */ }}
        />
      )}
    </div>
  );
}
