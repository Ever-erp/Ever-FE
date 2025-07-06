import React from "react";
import { useNavigate } from "react-router-dom";
import { NoticeItem } from "../../../types/notice";

interface PageRowProps {
  notice: NoticeItem;
}

const PageRow: React.FC<PageRowProps> = ({ notice }) => {
  const navigate = useNavigate();

  const handleNoticeClick = () => {
    navigate(`/notice/${notice.id}`);
  };

  // 타입에 따른 뱃지 스타일 결정
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SURVEY":
        return "bg-green-100 text-green-800 border-green-200";
      case "ALL_TYPE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 타입에 따른 표시 텍스트 결정
  const getTypeText = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "공지사항";
      case "SURVEY":
        return "설문조사";
      case "ALL_TYPE":
        return "전체";
      default:
        return type;
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      // ISO 형식의 날짜 문자열을 Date 객체로 변환
      const date = new Date(dateString);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return dateString; // 원본 문자열 반환
      }

      // YYYY-MM-DD 형식으로 포맷팅
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return dateString; // 원본 문자열 반환
    }
  };

  return (
    <div
      className="flex flex-row items-center w-full"
      onClick={handleNoticeClick}
    >
      <div className="w-16 text-center text-sm flex-shrink-0">{notice.id}</div>
      <div className="w-24 text-center flex justify-center flex-shrink-0">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(
            notice.type
          )}`}
        >
          {getTypeText(notice.type)}
        </span>
      </div>
      <div className="flex-1 text-left pl-20 text-sm truncate pr-4 min-w-0">
        {notice.title}
      </div>
      <div className="flex-1 text-center text-sm flex-shrink-0 truncate px-2">
        {notice.writer}
      </div>
      <div className="w-28 text-center text-sm flex-shrink-0">
        {formatDate(notice.targetDate || notice.registedAt)}
      </div>
    </div>
  );
};

export default PageRow;
