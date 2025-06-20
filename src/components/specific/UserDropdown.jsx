import { FiUser, FiBell, FiLogOut } from "react-icons/fi"; // 아이콘 import
import UserDropdownItem from "./UserDropdownItem";
import { motion } from "framer-motion";

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

const UserDropdown = () => {
  return (
    <motion.div
      className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
      transition={{ duration: 0.2 }}
    >
      <UserDropdownItem icon={FiUser} text="나의 프로필" />
      <UserDropdownItem icon={FiBell} text="공지 알림" />
      <div className="border-t border-gray-150" />
      <UserDropdownItem
        icon={FiLogOut}
        text="로그아웃"
        textColor="text-warning"
      />
    </motion.div>
  );
};

export default UserDropdown;
