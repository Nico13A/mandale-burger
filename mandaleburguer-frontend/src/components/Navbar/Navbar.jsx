
import React from "react";
import Button from "../Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { GetMenuItems } from "./GetMenuItems.jsx";

export default function Navbar({ active, setActive }) {
  const { user, loading } = useAuth();
  if (loading) {
    
    return (
      <nav className="fixed bottom-4 left-4 right-4 z-50">
        <div className="h-14 rounded-3xl bg-white/80 shadow-lg p-2 animate-pulse" />
      </nav>
    );
  }
  const role = user.groups;
  const items = GetMenuItems(role);
  
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="flex justify-between rounded-3xl bg-white shadow-lg p-2">
        {items.map(({ key, label, icon }) => (
          <Button
            key={key}
            onClick={() => setActive?.(key)}
            className={`flex flex-col items-center justify-center w-full ${
              active === key ? "font-bold text-blue-600" : "text-gray-600"
            }`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-xs mt-1 leading-none">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
