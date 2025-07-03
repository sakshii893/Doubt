import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

function MentorDashboard() {
  const { logout, user } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

 const fetchDoubts = async () => {
  try {
    const query = filter && filter !== "all" ? `?status=${filter}` : "";
    const res = await axios.get(`/doubts${query}`);

    // Optional: log to verify file links
    console.log("Fetched doubts:", res.data);

    setDoubts(res.data);
  } catch (err) {
    console.error("❌ Failed to fetch doubts:", err);
    toast.error("Failed to fetch doubts");
  }
};


  useEffect(() => {
    fetchDoubts();
  }, [filter]);

  const total = doubts.length;
  const resolvedCount = doubts.filter((d) => d.status === "resolved").length;
  const openCount = total - resolvedCount;

  return (
    <div style={{ padding: "30px", fontFamily: "Segoe UI" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div>
          <h2 style={{ marginBottom: "5px" }}>🧑‍🏫 Mentor Dashboard</h2>
          <p style={{ margin: 0 }}>📧 {user?.email}</p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "8px 14px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        backgroundColor: "#f0f4f8",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "25px",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)"
      }}>
        <h3 style={{ marginBottom: "15px" }}>📊 Doubt Stats</h3>
        <p><strong>Total Doubts:</strong> {total}</p>
        <p><strong>Open:</strong> {openCount}</p>
        <p><strong>Resolved:</strong> {resolvedCount}</p>

        <label style={{ marginTop: "10px", display: "inline-block" }}>
          🔎 Filter:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <h3 style={{ marginBottom: "15px" }}>📋 Doubts</h3>

      {doubts.length === 0 ? (
        <p>No doubts found.</p>
      ) : (
        doubts.map((doubt) => (
          <div
            key={doubt._id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "15px",
              padding: "15px",
              backgroundColor: doubt.status === "resolved" ? "#e6ffe6" : "#ffffff",
              borderLeft: doubt.status === "resolved" ? "6px solid #4caf50" : "6px solid #ff9800",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}
          >
            <h4 style={{ marginBottom: "5px" }}>{doubt.title}</h4>
            <p style={{ marginBottom: "8px" }}>{doubt.description}</p>
            <p><strong>Status:</strong> {doubt.status}</p>
            <p><strong>Student:</strong> {doubt.user?.name}</p>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Created: {new Date(doubt.createdAt).toLocaleString()}
            </p>

            {doubt.file && (
  <div style={{ marginTop: '8px' }}>
    <a href={doubt.file} target="_blank" rel="noreferrer">
      📎 View Attachment
    </a>
  </div>
)}
  
            <button
              onClick={() => navigate(`/doubt/${doubt._id}`)}
              style={{
                marginTop: "8px",
                backgroundColor: "#2196f3",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Reply to Doubt
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MentorDashboard;
