import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading/Loading";

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  const role = user.groups?.[0];

  switch(role) {
    case 'AppAdmin': return <Navigate to="/admin" replace />;
    case 'Cook': return <Navigate to="/cook" replace />;
    case 'Client': return <Navigate to="/client" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

export default RoleRedirect;
