import Logo from "./Logo";
import Menubar from "../specific/menu/Menubar";

const Sidebar = () => {
  return (
    <aside className="bg-gray-150 h-full rounded-xl flex flex-col">
      <Logo className="h-[10%] min-h-20 p-[15%] mb-3 flex items-center" />
      <Menubar />
    </aside>
  );
};

export default Sidebar;
