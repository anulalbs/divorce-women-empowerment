import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import axiosClient from "../../api/axiosClient";
import { useSelector } from "react-redux";


function Experts() {
    const [users, setUsers] = useState([]);
    const { profile } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(()=>{
         async function fetchData() {
    const response = await axiosClient.get("/users/experts");
    setUsers(response.data.users);
  }
  fetchData();
      
    },[])

    const columns = [
        {
            name: 'Name',
            selector: row => row.fullname,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Location',
            selector: row => row.location,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
        },
        {
            name: 'Role',
            selector: row => row.role, //TODO: remove this
        },
        {
            name: 'Is Active',
            selector: row => row.isActive ? 'Yes': 'No',
        },
    ];

    
    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="text-start">Experts</h2>
            {profile && profile.role === 'admin' && (<button
                type="button"
                onClick={() => navigate('/experts/create')}
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: 4,
                    cursor: 'pointer'
                }}
            >
                Add Expert
            </button>)}
        </div>
        <DataTable
            columns={columns}
            data={users}
            pagination
        />
        </>
    );
};

export default Experts;