import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnswerForm from './AnswerForm';
import './DoubtRoom.css'; 

const DoubtList = () => {
  const [doubts, setDoubts] = useState([]);
  const [answers, setAnswers] = useState({}); // Key: doubtId, Value: answers[]

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doubts`);
    setDoubts(res.data);

    // Fetch all answers
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

  return (
    <div className="doubt-list">
    {doubts.map((doubt) => (
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
  );
};

export default DoubtList;
