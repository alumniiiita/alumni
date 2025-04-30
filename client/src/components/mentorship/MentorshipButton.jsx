import React, { useState } from 'react';
import axios from 'axios';

const MentorshipButton = ({ userId }) => {
  const [showForm, setShowForm] = useState(false);
  const [area, setArea] = useState('Career');
  const [message, setMessage] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship`, {
      requestedTo: userId,
      areaOfHelp: area,
      message,
    });
    alert('Mentorship Request Sent!');
    setShowForm(false);
  };

  return (
    <div>
      {!showForm && (
        <button className="btn btn-outline-primary" onClick={() => setShowForm(true)}>
          Request Mentorship
        </button>
      )}

      {showForm && (
        <form onSubmit={handleRequest} style={{ marginTop: '1em' }}>
          <select value={area} onChange={(e) => setArea(e.target.value)} required>
            <option>Career</option>
            <option>Research</option>
            <option>Higher Studies</option>
            <option>Entrepreneurship</option>
            <option>Placements</option>
            <option>Other</option>
          </select>
          <textarea
            placeholder="Optional message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-success">
            Send Request
          </button>
        </form>
      )}
    </div>
  );
};

export default MentorshipButton;
