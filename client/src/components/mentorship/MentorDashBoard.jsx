import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MentorDashBoard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship/received`);
    setRequests(res.data);
  };

  const handleDecision = async (id, status) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship/${id}`, { status });
    fetchRequests();
  };

  return (
    <div className="container mt-4">
      <h2>Mentorship Requests</h2>
      {requests.length === 0 ? (
        <p>No mentorship requests yet.</p>
      ) : (
        requests.map((req) => (
          <div className="card p-3 my-3" key={req._id}>
            <p><strong>{req.requestedBy.name}</strong> requested help in <strong>{req.areaOfHelp}</strong></p>
            {req.message && <p><em>"{req.message}"</em></p>}
            <p>Status: <strong>{req.status}</strong></p>
            {req.status === 'pending' && (
              <div>
                <button className="btn btn-success mr-2" onClick={() => handleDecision(req._id, 'accepted')}>Accept</button>
                <button className="btn btn-danger" onClick={() => handleDecision(req._id, 'declined')}>Decline</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MentorDashBoard;
