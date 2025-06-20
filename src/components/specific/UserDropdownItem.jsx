const UserDropdownItem = ({
  icon: Icon,
  text,
  textColor = "text-gray-700",
  onClick,
}) => {
  return (
    <button
      className={`w-full flex items-center gap-2 text-left px-5 py-4 hover:bg-gray-200 ${textColor}`}
      onClick={onClick}
    >
      <Icon className="text-lg" />
      {text}
    </button>
  );
};

export default UserDropdownItem;
