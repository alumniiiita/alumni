import React, { useState, useEffect } from 'react';
import AnswerForm from './AnswerForm';
import axios from 'axios';
import './DoubtRoom.css'

const DoubtList = () => {
  const [doubts, setDoubts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [searchName, setSearchName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doubts`);
    setDoubts(res.data);

    const allAnswers = {};
    for (const doubt of res.data) {
      const ansRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doubts/${doubt._id}/answers`);
      allAnswers[doubt._id] = ansRes.data;
    }
    setAnswers(allAnswers);
  };

  const upvote = async (id) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doubts/${id}/upvote`);
    fetchDoubts();
  };

  const filteredDoubts = doubts.filter((doubt) => {
    const nameMatch = doubt.user.name.toLowerCase().includes(searchName.toLowerCase());
    const categoryMatch = !filterCategory || doubt.category === filterCategory;
    return nameMatch && categoryMatch;
  });

  return (
    <div className="doubt-room-wrapper">
      {/* 🔍 Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ padding: '0.6em 1em', borderRadius: '8px', border: '1px solid #ccc', width: '220px' }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '0.6em 1em', borderRadius: '8px', border: '1px solid #ccc', width: '220px' }}
        >
          <option value="">All Categories</option>
          <option value="General">General</option>
          <option value="Career">Career</option>
          <option value="Higher Studies">Higher Studies</option>
          <option value="Placements">Placements</option>
          <option value="Entrepreneurship">Entrepreneurship</option>
          <option value="Projects">Projects</option>
        </select>
      </div>

      {/* 🤔 Doubts */}
      <div className="doubt-list">
        {filteredDoubts.map((doubt) => (
          <div className="doubt-card" key={doubt._id}>
            <div className="doubt-header">
              <div className="doubt-meta">
                <img
                  src={doubt.user?.avatar || '/default-avatar.png'}
                  alt="avatar"
                  className="doubt-avatar"
                />
                <div>
                  <h4 className="doubt-question">{doubt.question}</h4>
                  <p className="doubt-info">
                    <span className="doubt-user">{doubt.user.name}</span> •{" "}
                    <span className="doubt-category">{doubt.category}</span>
                  </p>
                </div>
              </div>
              <button className="btn-upvote" onClick={() => upvote(doubt._id)}>
                ⬆ Upvote ({doubt.upvotes})
              </button>
            </div>

            {answers[doubt._id]?.length > 0 && (
              <div className="answer-list">
                {answers[doubt._id].map((ans, idx) => (
                  <div key={idx} className="answer-item">
                    <p>{ans.answer}</p>
                    <small>
                      — <strong>{ans.answeredBy?.name || 'Unknown'}</strong> at{" "}
                      {new Date(ans.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            )}

            <AnswerForm doubtId={doubt._id} refresh={fetchDoubts} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubtList;
