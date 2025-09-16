/*import { useAuthUser } from '../hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import Button from '../components/Button/Button';

const Home = () => {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>No se pudo cargar la información del usuario.</div>;


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">¡Bienvenido, {user.username}!</h2>
        <p className="mt-2 text-gray-600 text-center">Has iniciado sesión correctamente. Aquí puedes ver tu perfil o acceder a otras secciones de la aplicación.</p>

        <div className="mt-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-2">Información del Usuario</h3>
          <p><span className="font-medium">Nombre de usuario:</span> {user.username}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Rol:</span> {user.groups?.[0]}</p>
        </div>

        <Button
          onClick={handleLogout}
          className="mt-6 bg-gris-boton hover:bg-gris-boton-hover"
        >
          Cerrar sesión
        </Button>

      </div>
    </div>
  )
};

export default Home;


*/
/*
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido {user?.username}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
*/
/*
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout, loading } = useAuth(); // agregamos loading
  const navigate = useNavigate();

  if (loading) return <div>Cargando...</div>; // espera hasta que termine de cargar

  if (!user) {
    navigate("/login"); // redirige si no hay usuario
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido {user.username}</h1>
        <p className="text-gray-600 mb-6">Has iniciado sesión correctamente.</p>

        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.groups?.[0]}</p>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
*/
/*
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Redirigir al login si no hay usuario
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null; // mientras se redirige

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido {user.username}</h1>
        <p className="text-gray-600 mb-6">Has iniciado sesión correctamente.</p>

        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.groups?.[0]}</p>
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
  */




// src/pages/Home.jsx
/*
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido {user.username}</h1>
        <p className="text-gray-600 mb-6">Has iniciado sesión correctamente.</p>

        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
          <p>
            <strong>Usuario:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.groups?.[0]}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
*/