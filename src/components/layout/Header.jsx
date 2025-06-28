import UserProfile from "@/components/specific/userProfile/UserProfile";

const Header = () => {
  return (
    <header className="bg-gray-150 h-[10vh] min-h-18 rounded-xl px-10 flex items-center justify-end">
      <UserProfile />
    </header>
  );
};

export default Header;
