import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MentorDashBoard = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'x-auth-token': token };

    try {
      const [receivedRes, sentRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship/received`, { headers }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship/sent`, { headers }),
      ]);

      setReceivedRequests(receivedRes.data);
      setSentRequests(sentRes.data);
    } catch (error) {
      console.error("Error fetching mentorship requests:", error.message);
    }
  };

  const handleDecision = async (id, status) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship/${id}`, { status });
    fetchRequests();
  };

  return (
    <div className="container mt-4">
      <h2>Mentorship Dashboard</h2>

      <hr />
      <h4>📥 Requests You Received</h4>
      {receivedRequests.length === 0 ? (
        <p>No mentorship requests received yet.</p>
      ) : (
        receivedRequests.map((req) => (
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

      <hr />
      <h4>📤 Requests You Sent</h4>
      {sentRequests.length === 0 ? (
        <p>No mentorship requests sent yet.</p>
      ) : (
        sentRequests.map((req) => (
          <div className="card p-3 my-3" key={req._id}>
            <p>You requested help from <strong>{req.requestedTo.name}</strong> in <strong>{req.areaOfHelp}</strong></p>
            {req.message && <p><em>"{req.message}"</em></p>}
            <p>Status: <strong>{req.status}</strong></p>
          </div>
        ))
      )}
    </div>
  );
};

export default MentorDashBoard;
