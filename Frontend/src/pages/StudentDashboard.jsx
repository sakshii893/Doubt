import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  const [editDoubtId, setEditDoubtId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDoubt, setNewDoubt] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);

  const fetchDoubts = async () => {
    try {
      const res = await axios.get("/doubts/my-doubts");
      setDoubts(res.data);
    } catch (err) {
      console.error("Error fetching doubts", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const handleCreateChange = (e) => {
    setNewDoubt({ ...newDoubt, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newDoubt.title);
      formData.append("description", newDoubt.description);
      if (file) formData.append("file", file);

      await axios.post("/doubts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Doubt created");
      setNewDoubt({ title: "", description: "" });
      setFile(null);
      setShowCreateForm(false);
      fetchDoubts();
    } catch (err) {
      toast.error("Failed to create doubt");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doubt?")) {
      try {
        await axios.delete(`/doubts/${id}`);
        toast.success("Doubt deleted");
        fetchDoubts();
      } catch (err) {
        toast.error("Failed to delete doubt");
      }
    }
  };

  const handleEditClick = (doubt) => {
    setEditDoubtId(doubt._id);
    setEditForm({ title: doubt.title, description: doubt.description });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`/doubts/${id}`, editForm);
      toast.success("Doubt updated");
      setEditDoubtId(null);
      fetchDoubts();
    } catch (err) {
      toast.error("Failed to update doubt");
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Segoe UI" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div>
          <h2 style={{ marginBottom: "5px" }}>👋 Hello, {user?.name}</h2>
          <p style={{ margin: 0 }}>📧 {user?.email}</p>
          <p style={{ margin: 0 }}>🎓 Role: {user?.role}</p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "10px 18px",
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

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "500"
        }}
      >
        {showCreateForm ? "Cancel" : "+ Create New Doubt"}
      </button>

      {showCreateForm && (
        <div style={{ marginBottom: "30px", border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#fafafa" }}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newDoubt.title}
            onChange={handleCreateChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newDoubt.description}
            onChange={handleCreateChange}
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }}
          />
          <input type="file" onChange={handleFileChange} />
          {file && <p>📎 File selected: {file.name}</p>}
          <button
            onClick={handleCreateSubmit}
            style={{
              marginTop: "10px",
              backgroundColor: "#2196f3",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Submit Doubt
          </button>
        </div>
      )}

      <h3 style={{ marginBottom: "15px" }}>📚 Your Doubts</h3>

      {doubts.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#555" }}>You haven't asked any doubts yet.</p>
      ) : (
        doubts.map((doubt) => (
          <div
            key={doubt._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
              backgroundColor: doubt.status === "resolved" ? "#e6ffe6" : "#ffffff"
            }}
          >
            {editDoubtId === doubt._id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <button onClick={() => handleEditSubmit(doubt._id)} style={{ marginRight: "8px" }}>Save</button>
                <button onClick={() => setEditDoubtId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <h4>
                  <Link to={`/doubt/${doubt._id}`} style={{ textDecoration: "none", color: "#333" }}>
                    {doubt.title}
                  </Link>
                </h4>
                <p>{doubt.description}</p>
                <p><strong>Status:</strong> {doubt.status}</p>
                <p style={{ fontSize: "14px", color: "#777" }}>📅 {new Date(doubt.createdAt).toLocaleString()}</p>

                {doubt.file && (
                  <div style={{ marginTop: "6px" }}>
                    <a href={doubt.file} target="_blank" rel="noreferrer" style={{ color: "#2196f3", textDecoration: "underline" }}>
                      📎 View Attachment
                    </a>
                  </div>
                )}

                {doubt.status === "open" && (
                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => handleEditClick(doubt)} style={{ marginRight: "8px" }}>Edit</button>
                    <button onClick={() => handleDelete(doubt._id)} style={{ backgroundColor: "#f44336", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default StudentDashboard;
  