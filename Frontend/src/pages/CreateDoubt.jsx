import React, { useState } from 'react';
import axios from "../api/axios";
import { toast } from 'react-toastify';

function CreateDoubt() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (file) formData.append("file", file);

      await axios.post('/doubts', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Doubt created successfully!");
      setForm({ title: '', description: '' });
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating doubt");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Doubt</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", height: "100px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input type="file" onChange={handleFileChange} />
          {file && <p>📎 Selected file: {file.name}</p>}
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateDoubt;
