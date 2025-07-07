import { useEffect, useRef } from "react";
import { PiUserBold } from "react-icons/pi"; // 아이콘 변경 (원하는 아이콘으로 교체 가능)

const VacationPopover = ({ vacations, position, onClose, hideTimeout }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(hideTimeout.current);
    };
  }, [hideTimeout]);

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <div
      ref={popoverRef}
      className="fixed bg-white border border-gray-400 shadow-lg px-3 pb-2 rounded-lg z-50 w-36"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 제목 */}
      <div className="flex justify-center items-center pt-4 font-semibold text-brand text-center pb-2 border-b border-gray-200">
        <PiUserBold className="w-5 h-5" />
        <span> 휴가자 목록</span>
      </div>

      <div className="flex flex-col divide-y divide-gray-150 max-h-60 overflow-y-auto">
        {vacations.map((vac) => (
          <div
            key={vac.id}
            className="flex items-center justify-between gap-4 rounded-xl mt-1 px-3 py-2 cursor-default"
            title={`${vac.memberName} - ${vac.vacationType}`}
          >
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <span className="text-sm font-semibold text-brand truncate w-3/4">
                {vac.memberName}
              </span>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full w-fit whitespace-nowrap">
                {vac.vacationType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationPopover;
