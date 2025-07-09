import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItemProps {
  to: string;
  label: string;
  icon: ReactNode;
}

const MenuItem = ({ to, label, icon }: MenuItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseStyle =
    "w-full py-3 2xl:py-5 flex flex-row justify-center items-center gap-2 text-base 2xl:text-lg rounded-xl transition-color duration-300 ease-in-out group";
  const activeStyle = "bg-brand text-white font-semibold ";
  const inactiveStyle = "text-gray-400 hover:text-brand";

  return (
    <Link className="w-full" to={to}>
      <div className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
        <span className="w-8 h-8 flex items-center justify-center">{icon}</span>
        <div className="min-w-[90px]">{label}</div>
      </div>
    </Link>
  );
};

export default MenuItem;
