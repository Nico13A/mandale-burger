const MENUS = {
  Client: [
    { key: "Inicio",  label: "Inicio",  icon: "🏠" },
    { key: "Promos",  label: "Promos",  icon: "💸" },
    { key: "Carrito", label: "Carrito", icon: "🛒" },
    { key: "Pedidos", label: "Pedidos", icon: "📜" },
    { key: "Perfil",  label: "Perfil",  icon: "👤" },
  ],
  Cook: [
    { key: "Pedidos", label: "Pedidos", icon: "📜" },
    { key: "Cocina",  label: "Cocina",  icon: "👨‍🍳" },
    { key: "Perfil",  label: "Perfil",  icon: "👤" },
  ],
  AppAdmin: [
    { key: "Dashboard", label: "Dashboard", icon: "📊" },
    { key: "Usuarios",  label: "Usuarios",  icon: "👥" },
    { key: "Pedidos",   label: "Pedidos",   icon: "📜" },
    { key: "Perfil",    label: "Perfil",    icon: "👤" },
  ],
};

export function GetMenuItems(role) {
  return MENUS[role] || []; 
}
