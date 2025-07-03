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

        

        <div className="button-group">
         <button className="btn blue" onClick={() => navigate("/login")}>Login</button>
<button className="btn white" onClick={() => navigate("/register")}>Register</button>

        </div>

      </div>
    </div>
  );
}

export default Home;
