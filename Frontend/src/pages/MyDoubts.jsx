import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function MyDoubts() {
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    const fetchDoubts = async () => {
      const res = await axios.get('/doubts/my-doubts');
      setDoubts(res.data);
    };
    fetchDoubts();
  }, []);

  return (
    <div>
      <h2>My Doubts</h2>
      {doubts.map((doubt) => (
        <div key={doubt._id}>
          <h4>{doubt.title}</h4>
          <p>{doubt.description}</p>
          <p>Status: {doubt.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyDoubts;
