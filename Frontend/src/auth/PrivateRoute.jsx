import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // or a spinner

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}

export default PrivateRoute;
