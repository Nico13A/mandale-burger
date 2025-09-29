import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RoleRedirect from "./RoleRedirect";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CocinerosList from "../pages/Admin/CocinerosList";
import AdminCocineroForm from "../pages/Admin/AdminCocineroForm";

import CookDashboard from "../pages/Cook/CookDashboard";

import ClientLayout from "../layouts/ClientLayout";
import ClientDashboard from "../pages/Client/ClientDashboard";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";

const AppRouter = () => {
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
      {/* Admin */}
      <Route element={<PrivateRoutes allowedRoles={["AppAdmin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cocineros" element={<CocinerosList />} />
          <Route path="/admin/cocineros/nuevo" element={<AdminCocineroForm isEdit={false} />} />
          <Route path="/admin/cocineros/editar/:id" element={<AdminCocineroForm isEdit={true} />} />
        </Route>
      </Route>


      <Route element={<PrivateRoutes allowedRoles={['Cook']} />}>
        <Route path="/cook" element={<CookDashboard />} />
      </Route>


      {/* Cliente */}
      <Route element={<PrivateRoutes allowedRoles={['Client']} />}>
        <Route element={<ClientLayout />}>
          <Route path="/client" element={<ClientDashboard />} />
        </Route>
      </Route>


      {/* Redirección por defecto si no existe la ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;

