import React, { useEffect, useState } from "react";
import axios from  "../api/axios"
import { useNavigate } from "react-router-dom";

function MentorDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchDoubts = async () => {
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const res = await axios.get(`/doubts${query}`);
      setDoubts(res.data);
    } catch (err) {
      console.error("Failed to fetch doubts", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [filter]);

  const total = doubts.length;
  const resolvedCount = doubts.filter((d) => d.status === "resolved").length;
  const openCount = total - resolvedCount;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧑‍🏫 Mentor Dashboard</h2>

      <div style={{ marginBottom: "20px", backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "6px" }}>
        <p><strong>Total Doubts:</strong> {total}</p>
        <p><strong>Resolved:</strong> {resolvedCount}</p>
        <p><strong>Open:</strong> {openCount}</p>

        <label style={{ marginTop: "10px" }}>Filter by Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: "10px" }}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {doubts.length === 0 ? (
        <p>No doubts found.</p>
      ) : (
        doubts.map((doubt) => (
          <div
            key={doubt._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "15px",
              padding: "15px",
              backgroundColor: doubt.status === "resolved" ? "#e0ffe0" : "#fff",
              borderLeft: doubt.status === "resolved" ? "5px solid green" : "5px solid orange",
              borderRadius: "4px"
            }}
          >
            <h4>{doubt.title}</h4>
            <p>{doubt.description}</p>
            <p><strong>Status:</strong> {doubt.status}</p>
            <p><strong>Student:</strong> {doubt.user?.name}</p>
            <p><strong>Created:</strong> {new Date(doubt.createdAt).toLocaleString()}</p>
            <button onClick={() => navigate(`/doubt/${doubt._id}`)}>Reply</button>
          </div>
        ))
      )}
    </div>
  );
}

export default MentorDashboard;
