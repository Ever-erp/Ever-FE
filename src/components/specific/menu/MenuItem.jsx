import { Link, useLocation } from "react-router-dom";

const MenuItem = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseStyle =
    "w-full py-5 flex flex-row justify-center items-center gap-2 text-lg rounded-xl transition-color duration-300 ease-in-out group";
  const activeStyle = "bg-brand text-white font-semibold ";
  const inactiveStyle = "text-gray-400 hover:text-brand";

  return (
    <Link className="w-full" to={to}>
      <div className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
        <span className="w-8 h-8 flex items-center justify-center">{icon}</span>
        {/* <span className="group-hover:underline group-hover:decoration-brand underline-offset-8 decoration-2"> */}
        <div className="min-w-[90px]">{label}</div>
        {/* </span> */}
      </div>
    </Link>
  );
};

export default MenuItem;
