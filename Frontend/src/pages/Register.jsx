import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import { toast } from 'react-toastify';
import { AuthContext } from '../auth/AuthContext';
import './Register.css'; // You can create this CSS file for styling

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success("Registered successfully!");
      navigate('/dash');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create Account</h2>

        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>

        <button className="submit-btn" type="submit">Register</button>

        <p className="switch-auth">
          Already have an account?{" "}
          <span onClick={() => navigate('/login')} style={{ color: "#2196f3", cursor: "pointer", textDecoration: "underline" }}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
