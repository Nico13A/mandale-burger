import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 

const PerfilDropdown = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const rolePathMap = {
    AppAdmin: "admin",
    Cook: "cook",
    Client: "client",
  };

  const handleProfileClick = () => {
    const role = user?.groups?.[0]; 
    const path = rolePathMap[role] || "client"; 
    navigate(`/${path}/profile`);
  };

  return (
    <Menu as="div" className="relative">
      {/* Botón del perfil */}
      <MenuButton className="flex items-center space-x-1 px-3 py-2 text-gris-boton hover:text-naranja-boton-hover rounded cursor-pointer focus:outline-none">
        <UserIcon className="w-5 h-5" />
        <span className="hidden md:inline">Perfil</span>
        <ChevronDownIcon className="w-4 h-4" />
      </MenuButton>

      {/* Dropdown */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <MenuItems className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-md z-50 focus:outline-none focus:ring-0">
          <MenuItem
            as="button"
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 focus:outline-none"
          >
            Editar perfil
          </MenuItem>
          <MenuItem
            as="button"
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-naranja-boton cursor-pointer hover:bg-gray-100 focus:outline-none"
          >
            Cerrar sesión
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default PerfilDropdown;






