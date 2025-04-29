import React, { useState } from 'react';
import axios from 'axios';

const AnswerForm = ({ doubtId, refresh }) => {
  const [answer, setAnswer] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doubts/${doubtId}/answer`, { answer });
    setAnswer('');
    refresh();
  };

  return (
    <form onSubmit={onSubmit} style={{ marginTop: '1em' }}>
      <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write your answer..." required />
      <button type="submit">Answer</button>
    </form>
  );
};

export default AnswerForm;
