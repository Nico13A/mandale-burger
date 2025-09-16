import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.groups?.[0];

  switch(role) {
    case 'AdminApp': return <Navigate to="/admin" replace />;
    case 'Cook': return <Navigate to="/cook" replace />;
    case 'Client': return <Navigate to="/client" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

export default RoleRedirect;
