import Logo from "./Logo";
import Menubar from "../specific/Menubar";

const Sidebar = () => {
  return (
    <aside className="bg-gray-150 w-[10%] min-w-[150px] h-full rounded-xl flex flex-col">
      <Logo />
      <Menubar />
    </aside>
  );
};

export default Sidebar;
