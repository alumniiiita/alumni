import React, { useState } from 'react';
import axios from 'axios';

const DoubtForm = ({ refresh }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('General');

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doubts`, { question, category });
    setQuestion('');
    refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a doubt..." required />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>General</option>
        <option>Career</option>
        <option>Higher Studies</option>
        <option>Placements</option>
        <option>Entrepreneurship</option>
        <option>Projects</option>
      </select>
      <button type="submit">Ask</button>
    </form>
  );
};

export default DoubtForm;
