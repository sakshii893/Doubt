import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const { user } = useContext(AuthContext);
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
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {/* 🔘 Toggle Create Form */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {showCreateForm ? "Cancel" : "+ Create New Doubt"}
      </button>

      {showCreateForm && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newDoubt.title}
            onChange={handleCreateChange}
            style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newDoubt.description}
            onChange={handleCreateChange}
            style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
          ></textarea>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginBottom: "5px" }}
          />
          {file && <p>📎 Selected file: {file.name}</p>}
          <button
            onClick={handleCreateSubmit}
            style={{
              marginTop: "8px",
              backgroundColor: "#2196f3",
              color: "white",
              padding: "8px 14px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Submit
          </button>
        </div>
      )}

      <hr />
      <h3>Your Doubts</h3>

      {doubts.length === 0 ? (
        <p>You haven't asked any doubts yet.</p>
      ) : (
        doubts.map((doubt) => (
          <div
            key={doubt._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              backgroundColor: doubt.status === "resolved" ? "#e0ffe0" : "#fff",
            }}
          >
            {editDoubtId === doubt._id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                />
                <button onClick={() => handleEditSubmit(doubt._id)}>Save</button>
                <button onClick={() => setEditDoubtId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <h4>
                  <Link
                    to={`/doubt/${doubt._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {doubt.title}
                  </Link>
                </h4>
                <p>{doubt.description}</p>
                <p>
                  Status: <strong>{doubt.status}</strong>
                </p>
                <p>Created: {new Date(doubt.createdAt).toLocaleString()}</p>

             {doubt.file && (
  <div style={{ marginTop: '8px' }}>
    <a href={doubt.file} target="_blank" rel="noreferrer">
      📎 View Attachment
    </a>
  </div>
)}

                {doubt.status === "open" && (
                  <>
                    <button onClick={() => handleEditClick(doubt)}>Edit</button>
                    <button onClick={() => handleDelete(doubt._id)}>Delete</button>
                  </>
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
