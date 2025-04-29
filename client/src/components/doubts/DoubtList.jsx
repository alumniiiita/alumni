import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnswerForm from './AnswerForm';

const DoubtList = () => {
  const [doubts, setDoubts] = useState([]);
  const [answers, setAnswers] = useState({}); // Key: doubtId, Value: answers[]
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

  // 🧹 Apply live filters
  const filteredDoubts = doubts.filter((doubt) => {
    const matchesName = doubt.user.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = filterCategory === '' || doubt.category === filterCategory;
    return matchesName && matchesCategory;
  });

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Doubts Posted</h2>

      {/* Search Bar and Filter Dropdown */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{
            padding: "0.7em",
            borderRadius: "8px",
            border: "1px solid lightgray",
            width: "250px"
          }}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "0.7em",
            borderRadius: "8px",
            border: "1px solid lightgray",
            width: "200px"
          }}
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

      {/* List of doubts */}
      {filteredDoubts.length > 0 ? (
        filteredDoubts.map((doubt) => (
          <div
            key={doubt._id}
            style={{
              marginBottom: '1.5em',
              padding: '1em',
              border: '1px solid #ccc',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <h4>{doubt.question}</h4>
            <p><strong>By:</strong> {doubt.user.name}</p>
            <p><strong>Category:</strong> {doubt.category}</p>

            <button onClick={() => upvote(doubt._id)} style={{ marginBottom: "1rem" }}>
              Upvote ({doubt.upvotes})
            </button>

            {/* Show existing answers */}
            {answers[doubt._id] && answers[doubt._id].length > 0 && (
              <div style={{ marginTop: '1em' }}>
                <strong>Answers:</strong>
                <ul style={{ marginTop: '0.5em' }}>
                  {answers[doubt._id].map((ans, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5em' }}>
                      <p>{ans.answer}</p>
                      <small>
                        — <strong>{ans.answeredBy?.name || 'Unknown'}</strong> at{" "}
                        {new Date(ans.createdAt).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Answer input */}
            <AnswerForm doubtId={doubt._id} refresh={fetchDoubts} />
          </div>
        ))
      ) : (
        <h4 style={{ textAlign: "center", marginTop: "2rem" }}>No Doubts Found</h4>
      )}
    </div>
  );
};

export default DoubtList;
