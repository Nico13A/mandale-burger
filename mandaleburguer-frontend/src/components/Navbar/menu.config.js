import {
  HomeIcon,
  ShoppingCartIcon,
  UserIcon,
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BoltIcon
} from "@heroicons/react/24/solid";

export const MENUS = {
  Client: [
    { key: "Inicio",  label: "Inicio",  icon: HomeIcon },
    { key: "Promos",  label: "Promos",  icon: BoltIcon },
    { key: "Carrito", label: "Carrito", icon: ShoppingCartIcon, hideLabel: true }, 
    { key: "Pedidos", label: "Pedidos", icon: ClipboardDocumentListIcon },
    { key: "Perfil",  label: "Perfil",  icon: UserIcon },
  ],
  Cook: [
    { key: "Pedidos", label: "Pedidos", icon: ClipboardDocumentListIcon },
    { key: "Cocina",  label: "Cocina",  icon: BoltIcon }, 
    { key: "Perfil",  label: "Perfil",  icon: UserIcon },
  ],
  AppAdmin: [
    { key: "Dashboard", label: "Dashboard", icon: ChartBarIcon },
    { key: "Usuarios",  label: "Usuarios",  icon: UsersIcon },
    { key: "Pedidos",   label: "Pedidos",   icon: ClipboardDocumentListIcon },
    { key: "Perfil",    label: "Perfil",    icon: UserIcon },
  ],
};

export function getMenuItems(role) {
  return MENUS[role] || [];
}

