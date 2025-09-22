import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RoleRedirect from "./RoleRedirect";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import CookDashboard from "../pages/Cook/CookDashboard";
import ClientDashboard from "../pages/Client/ClientDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";

function AppRouter() {
  return (
    <Routes>
      {/* Redirige la raíz según si el usuario está logueado */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password/reset" element={<ForgotPassword />} />
      <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />

      {/* Rutas privadas por rol */}
      <Route element={<PrivateRoutes allowedRoles={['AppAdmin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<PrivateRoutes allowedRoles={['Cook']} />}>
        <Route path="/cook" element={<CookDashboard />} />
      </Route>

      <Route element={<PrivateRoutes allowedRoles={['Client']} />}>
        <Route path="/client" element={<ClientDashboard />} />
      </Route>

      {/* Redirección por defecto si no existe la ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;

