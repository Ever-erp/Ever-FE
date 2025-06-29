import { useEffect, useRef } from "react";
import { PiClipboardTextBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const NoticePopover = ({ notices, position, onClose, hideTimeout }) => {
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 언마운트 될 때도 타이머 클리어
    return () => {
      clearTimeout(hideTimeout.current);
    };
  }, [hideTimeout]);

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current); // 팝오버에 들어오면 타이머 취소
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      onClose(); // 일정 시간 뒤 닫기
    }, 100); // 이 시간 동안 다시 들어가면 취소됨
  };

  return (
    <div
      ref={popoverRef}
      className="fixed bg-white border border-gray-400 shadow-lg px-3 pb-2 rounded-lg z-50 w-72"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 제목 */}
      <div className="flex justify-center items-center pt-4 font-semibold text-brand text-center pb-2 border-b border-gray-200">
        <PiClipboardTextBold className="w-5 h-5" />
        <span> 공지사항 바로가기</span>
      </div>

      <div className="flex flex-col divide-y divide-gray-150 max-h-[200px] overflow-y-auto">
        {notices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => navigate(`/notice/${notice.id}`)}
            className="flex items-center justify-between gap-4 rounded-xl mt-1 px-3 py-2 cursor-pointer hover:bg-brand/10 transition-colors"
          >
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <span className="text-sm font-semibold text-brand truncate w-3/4">
                {notice.title}
              </span>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full w-fit whitespace-nowrap">
                {notice.writer ?? "작성자 없음"}
              </span>
            </div>
            <span className="text-gray-400 text-lg shrink-0 select-none">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticePopover;
