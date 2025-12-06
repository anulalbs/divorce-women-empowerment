import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import axiosClient from "../../api/axiosClient";
import { useSelector } from "react-redux";
import AdminReportsModal from './AdminReportsModal';


function Experts() {
    const [users, setUsers] = useState([]);
    const [modalExpert, setModalExpert] = useState(null);
    const { profile } = useSelector((state) => state.user);
    const navigate = useNavigate();
    // fetchData is exposed so we can refresh the list after admin actions
    const fetchData = async () => {
        try {
            const response = await axiosClient.get("/users/experts");
            setUsers(response.data.users || []);
        } catch (err) {
            console.error('Failed to load experts', err);
        }
    };

    useEffect(()=>{
        fetchData();
    },[])

        const openReports = (row) => {
            setModalExpert(row);
        }

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
        {
            name: 'Reports',
            cell: row => (
                profile && profile.role === 'admin' ? (
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => openReports(row)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openReports(row); }}
                        aria-label={`View reports for ${row.fullname}`}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" fill="#fff"/>
                        </svg>
                    </span>
                ) : null
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
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
        {modalExpert && (
            <AdminReportsModal expert={modalExpert} onClose={() => setModalExpert(null)} onUpdated={() => { fetchData(); setModalExpert(null); }} />
        )}
        </>
    );
};

export default Experts;