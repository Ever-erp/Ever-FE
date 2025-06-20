import UserProfile from "../specific/UserProfile";

const Header = () => {
  return (
    <header className="bg-gray-150 h-[10%] min-h-20 rounded-xl px-10 flex items-center justify-end">
      <UserProfile />
    </header>
  );
};

export default Header;
