import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RoleRedirect from "./RoleRedirect";

// ADMIN
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CocinerosList from "../pages/Admin/CocinerosList";
import AdminCocineroForm from "../pages/Admin/AdminCocineroForm";
import ClientList from "../pages/Admin/ClientList";
import AdminClientForm from "../pages/Admin/AdminClientForm";
import PromocionesList from "../pages/Admin/PromocionesList";
import AdminPromocionForm from "../pages/Admin/AdminPromocionForm";
import AdminPromocionEditForm from "../pages/Admin/AdminPromocionEditForm";
import Ingredientes from "../pages/Admin/Ingredientes";
import IngredienteForm from "../pages/Admin/IngredienteForm";

// COCINERO
import CookDashboard from "../pages/Cook/CookDashboard";

// CLIENTE
import ClientLayout from "../layouts/ClientLayout";
import ClientDashboard from "../pages/Client/ClientDashboard";
import Posts from "../pages/Client/Posts";
import PostDetail from "../pages/Client/PostDetail";
import PromoDetalle from "../pages/Client/PromoDetalle";

// PUBLIC
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import Carrito from "../pages/Client/Carrito";

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
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/cocineros" element={<CocinerosList />} />
          <Route path="/admin/cocineros/nuevo" element={<AdminCocineroForm isEdit={false} />} />
          <Route path="/admin/cocineros/editar/:id" element={<AdminCocineroForm isEdit={true} />} />
          <Route path="/admin/clientes" element={<ClientList />} />
          <Route path="/admin/clientes/editar/:id" element={<AdminClientForm />} />
          <Route path="/admin/promociones" element={<PromocionesList />} />
          <Route path="/admin/promociones/nuevo" element={<AdminPromocionForm />} />
          <Route path="/admin/promociones/editar/:id" element={<AdminPromocionEditForm />} />

          <Route path="/admin/ingredientes" element={<Ingredientes />} />
          <Route path="/admin/ingredientes/nuevo" element={<IngredienteForm />} />
          <Route path="/admin/ingredientes/:id" element={<IngredienteForm />} />



          <Route path="/admin/posts" element={<Posts />} />
          <Route path="/admin/posts/:id" element={<PostDetail />} />
        </Route>
      </Route>


      <Route element={<PrivateRoutes allowedRoles={['Cook']} />}>
        <Route path="/cook" element={<CookDashboard />} />
      </Route>


      {/* Cliente */}
      <Route element={<PrivateRoutes allowedRoles={['Client']} />}>
        <Route element={<ClientLayout />}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/promociones/:id" element={<PromoDetalle />} />
          <Route path="/client/carrito" element={<Carrito />} />




          <Route path="/client/posts" element={<Posts />} />
          <Route path="/client/posts/:id" element={<PostDetail />} />
        </Route>
      </Route>

      {/* Ruta de cambio de contraseña accesible para cualquier usuario logueado */}
      <Route element={<PrivateRoutes allowedRoles={['AppAdmin', 'Cook', 'Client']} />}>
        <Route path="/profile/change-password" element={<ChangePassword />} />
      </Route>


      {/* Redirección por defecto si no existe la ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;

