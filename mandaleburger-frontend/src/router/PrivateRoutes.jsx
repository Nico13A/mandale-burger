import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading/Loading";

const PrivateRoutes = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  const role = user.groups?.[0];
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoutes;
