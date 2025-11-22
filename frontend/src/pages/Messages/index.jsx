import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import ChatWindow from "./ChatWindow";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const res = await axiosClient.get("/users/experts");
      setUsers(res.data.users||[]);
    }
    loadUsers();
  }, []);

  return (
    <div className="d-flex gap-3">
      <div style={{ width: 250 }} className="list-group">
        {users.map(u => (
          <button key={u._id} className={`list-group-item list-group-item-action ${selected?._id === u._id ? 'active' : ''}`} onClick={() => setSelected(u)}>
            {u.fullname}
          </button>
        ))}
      </div>
      <div className="flex-grow-1">
        {selected ? <ChatWindow otherUser={selected} /> : <div className="p-3">Select a user to chat</div>}
      </div>
    </div>
  );
}
