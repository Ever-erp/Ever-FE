import { useState } from "react";
import UserDropdown from "./UserDropdown";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import dogImage from "@/assets/images/dog.jpg";

const UserProfile = () => {
  const user = useSelector((state) => state.user.user);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full p-4 flex items-center gap-4 rounded-xl hover:bg-gray-100 cursor-pointer">
        {/* 프로필 이미지 */}
        <div className="w-14 h-14 rounded-full border border-gray-300 flex justify-center items-center overflow-hidden">
          <img
            src={user?.image ? user.image : dogImage}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 이름과 이메일 */}
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-gray-800">
            {user.name}
          </span>
          <span className="text-sm text-gray-400">{user.email}</span>
        </div>

        {/* 드롭다운 메뉴 */}
        <AnimatePresence>{isHovered && <UserDropdown />}</AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
