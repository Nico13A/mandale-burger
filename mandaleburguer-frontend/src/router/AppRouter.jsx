import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RoleRedirect from "./RoleRedirect";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import CookDashboard from "../pages/Cook/CookDashboard";
import ClientDashboard from "../pages/Client/ClientDashboard";
import Login from "../pages/Login";

function AppRouter() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Ruta para redirigir al dashboard según rol */}
      <Route path="/redirect" element={<RoleRedirect />} />

      {/* Rutas privadas por rol */}
      <Route element={<PrivateRoutes allowedRoles={['AdminApp']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<PrivateRoutes allowedRoles={['Cook']} />}>
        <Route path="/cook" element={<CookDashboard />} />
      </Route>

      <Route element={<PrivateRoutes allowedRoles={['Client']} />}>
        <Route path="/client" element={<ClientDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
