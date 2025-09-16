import api from './api';

export const login = async (username, password) => {
  try {
    const res = await api.post('/api/token/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return res.data; 
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'Error en el login';
    throw new Error(mensaje);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get('/api/user/'); 
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'No se pudo obtener el usuario';
    throw new Error(mensaje);
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('No hay refresh token disponible');
  
  try {
    const res = await api.post('/api/token/refresh/', { refresh });
    localStorage.setItem('access_token', res.data.access);
    return res.data.access;
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'No se pudo refrescar la sesión';
    logout();
    throw new Error(mensaje);
  }
};
