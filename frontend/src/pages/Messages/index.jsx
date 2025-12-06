import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import ChatWindow from "./ChatWindow";
import { useLocation } from "react-router-dom";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [reportedIds, setReportedIds] = useState(new Set());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const res = await axiosClient.get("/users/experts");
      const list = res.data.users||[];
      setUsers(list);
      // batch-check reported experts
      const ids = list.map((x) => x._id || x.id).filter(Boolean);
      if (ids.length) {
        try {
          const r = await axiosClient.get(`/reports/check?expertIds=${ids.join(",")}`);
          setReportedIds(new Set((r.data.reportedIds || []).map(String)));
        } catch (e) {
          console.warn('Failed to check reported experts', e);
        }
      }
    }
    loadUsers();
  }, []);

  // if navigated from experts page with a selected expert, preselect
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.selectedExpert) {
      setSelected(location.state.selectedExpert);
    }
  }, [location?.state]);

  return (
    <div className="d-flex gap-3">
      <div style={{ width: 250 }} className="list-group">
        {users.map(u => {
          const isReported = reportedIds.has(String(u._id || u.id));
          return (
            <div key={u._id} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className={`list-group-item list-group-item-action ${selected?._id === u._id ? 'active' : ''}`}
                onClick={() => setSelected(u)}
                disabled={isReported}
                title={isReported ? 'Chat disabled for this expert due to an active report' : ''}
                style={{ flex: 1, textAlign: 'left' }}
              >
                {u.fullname}
              </button>
              {isReported && (
                <span
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#d9534f',
                    color: '#fff',
                    padding: '2px 8px',
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
          );
        })}
      </div>
      <div className="flex-grow-1">
        {selected ? (
          reportedIds.has(String(selected._id || selected.id)) ? (
            <div className="p-3">Chat is disabled for this expert due to an active report.</div>
          ) : (
            <ChatWindow otherUser={selected} />
          )
        ) : (
          <div className="p-3">Select a user to chat</div>
        )}
      </div>
    </div>
  );
}
