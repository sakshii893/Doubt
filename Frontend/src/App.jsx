import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import CreateDoubt from "./pages/CreateDoubt";
import MyDoubts from "./pages/MyDoubts";
import DoubtDetail from "./pages/DoubtDetail";
import Home from "./pages/Home";

import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  const { user } = useContext(AuthContext);

  // Optional: Show loader while checking user context (on first load)
  if (user === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <ToastContainer />
      
     

      <Routes>
        {/* Public Routes */}
        
<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-Based Dashboards */}
        <Route
          path="/dash"
          element={
            <PrivateRoute>
              {user?.role === "student" ? <StudentDashboard /> : <MentorDashboard />}
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/create"
          element={
            <PrivateRoute role="student">
              <CreateDoubt />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-doubts"
          element={
            <PrivateRoute role="student">
              <MyDoubts />
            </PrivateRoute>
          }
        />

        {/* Shared Route: View Doubt Detail */}
        <Route
          path="/doubt/:id"
          element={
            <PrivateRoute>
              <DoubtDetail />
            </PrivateRoute>
          }
        />

        

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
