import React, { useState } from 'react';
import DoubtForm from './DoubtForm';
import DoubtList from './DoubtList';
import './DoubtRoom.css'; // 🔥 Add this line to include styles

const DoubtRoom = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="doubt-room">
      <div className="doubt-room-header">
        <h1>💡 Ask Me Anything</h1>
        <p className="doubt-subtext">
          Post your doubts. Get help from peers, alumni, and faculty across different categories like Placements, Career, Projects, and more.
        </p>
      </div>

      <div className="doubt-form-container">
        <DoubtForm refresh={triggerRefresh} />
      </div>

      <hr className="doubt-divider" />

      <DoubtList key={refreshKey} />
    </div>
  );
};

export default DoubtRoom;
