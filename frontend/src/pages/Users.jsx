import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import axiosClient from "../api/axiosClient";

function Users() {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
         async function fetchData() {
    const response = await axiosClient.get("/users");
    console.log("🚀 ~ fetchData ~ response:", response)
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
            selector: row => row.role,
        },
        {
            name: 'Is Active',
            selector: row => row.isActive ? 'Yes': 'No',
        },
    ];

    
    return (
        <>
        <h2 className="text-start">Users</h2>
        <DataTable
            columns={columns}
            data={users}
            pagination
        />
        </>
    );
};

export default Users;