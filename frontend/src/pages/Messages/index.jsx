import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import ChatWindow from "./ChatWindow";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [reportedIds, setReportedIds] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const { profile } = useSelector((s) => s.user || {});

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      if (!profile) return;
      try {
        let list = [];
        if (profile.role === 'admin') {
          const [usersRes, expertsRes] = await Promise.all([
            axiosClient.get('/users'),
            axiosClient.get('/users/experts'),
          ]);
          list = [...(usersRes.data.users || []), ...(expertsRes.data.users || [])];
        } else if (profile.role === 'expert') {
          const res = await axiosClient.get('/users');
          list = res.data.users || [];
        } else {
          const res = await axiosClient.get('/users/experts');
          list = res.data.users || [];
        }

        // exclude current logged in user
        const myId = String(profile._id || profile.id);
        list = list.filter((u) => String(u._id || u.id) !== myId);

        if (!mounted) return;
        setUsers(list);

        const ids = list.map((x) => x._id || x.id).filter(Boolean);
        if (ids.length) {
          try {
            const r = await axiosClient.get(`/reports/check?expertIds=${ids.join(',')}`);
            if (!mounted) return;
            setReportedIds(new Set((r.data.reportedIds || []).map(String)));
          } catch (e) {
            console.warn('Failed to check reported experts', e);
          }
        }
      } catch (err) {
        console.error('Failed to load users for messages', err);
      }
    }
    loadUsers();
    return () => { mounted = false; };
  }, [profile]);

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
            <div key={u._id || u.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className={`list-group-item list-group-item-action ${String(selected?._id || selected?.id) === String(u._id || u.id) ? 'active' : ''}`}
                onClick={() => setSelected(u)}
                disabled={isReported}
                title={isReported ? 'Chat disabled for this user due to an active report' : ''}
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
          )
        })}
      </div>
      <div className="flex-grow-1">
        {selected ? (
          reportedIds.has(String(selected._id || selected.id)) ? (
            <div className="p-3">Chat is disabled for this user due to an active report.</div>
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
