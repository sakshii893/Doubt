import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // External CSS

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-content">
        <h1 className="home-title">📚 Doubt Tracker</h1>
        <p className="home-subtitle">
          One platform to ask, solve, and track doubts — effortlessly.
        </p>

        <img
          className="home-image"
          src="https://cdni.iconscout.com/illustration/premium/thumb/student-asking-doubt-4272364-3565436.png"
          alt="Doubt Tracker Illustration"
        />

        <div className="button-group">
         <button className="btn blue" onClick={() => navigate("/login")}>Login</button>
<button className="btn white" onClick={() => navigate("/register")}>Register</button>

        </div>

        <div className="feature-section">
          <h2>🚀 Features:</h2>
          <ul className="feature-list">
            <li>📝 Ask doubts with screenshots or files</li>
            <li>✅ Mentors reply and resolve them fast</li>
            <li>📦 Keep track of all your past questions</li>
            <li>🔒 Enjoy secure role-based access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
