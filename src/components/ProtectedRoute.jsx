// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // logged in but not allowed → go home
    return <Navigate to="/" replace />;
  }

  // allowed → render page
  return children;
};

export default ProtectedRoute;
