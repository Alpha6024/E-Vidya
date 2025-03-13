import React, { useState, useEffect } from "react";

const StaffDashboard = () => {
    const [requests, setRequests] = useState([]);

    // ✅ Fetch Pending Requests
    const fetchRequests = async () => {
        const response = await fetch("http://localhost:5000/pendingRequests");
        const data = await response.json();
        setRequests(data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // ✅ Approve or Reject Login Request
    const handleApproval = async (id, status) => {
        await fetch(`http://localhost:5000/approveLogin/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchRequests();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Student Login Requests</h1>
            {requests.map((req) => (
                <div key={req._id} className="bg-gray-200 p-3 rounded flex justify-between mb-2">
                    <span>{req.enrollmentNo}</span>
                    <div>
                        <button onClick={() => handleApproval(req._id, "Approved")} className="bg-green-500 px-3 py-1 rounded text-white mr-2">
                            Approve
                        </button>
                        <button onClick={() => handleApproval(req._id, "Rejected")} className="bg-red-500 px-3 py-1 rounded text-white">
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaffDashboard;
