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

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";

    const dateMatch = dateString.match(/^\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return dateMatch[0];
    }
    const parts = dateString.split(" ");
    if (parts.length > 0) {
      return parts[0];
    }
    return dateString;
  };

  // 타입에 따른 뱃지 렌더링
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "NOTICE":
        return (
          <div className="text-blue-600 border border-blue-600 rounded-md px-2 py-1 text-xs font-medium">
            공지
          </div>
        );
      case "SURVEY":
        return (
          <div className="text-green-600 border border-green-600 rounded-md px-2 py-1 text-xs font-medium">
            설문
          </div>
        );
      case "ALL_TYPE":
        return (
          <div className="text-gray-600 border border-gray-600 rounded-md px-2 py-1 text-xs font-medium">
            전체
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-2 py-1 text-xs font-medium">
            {type}
          </div>
        );
    }
  };

  // 화면 크기에 따른 제목 텍스트 줄임 함수
  const truncateTitle = (title: string): string => {
    if (!title) return "-";

    // 화면 크기에 따른 동적 maxLength 계산
    const getResponsiveMaxLength = (): number => {
      const width = window.innerWidth;
      if (width >= 2560) return 60; // 2560px 이상 데스크탑
      if (width >= 1920) return 50; // 1920px 이상 데스크탑
      if (width >= 1600) return 40; // 1600px 이상 데스크탑
      if (width >= 1024) return 30; // 1024px 이상 랩탑
      if (width >= 768) return 25; // 768px 이상 태블릿
      return 20; // 768px 미만 모바일
    };

    const maxLength = getResponsiveMaxLength();

    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={`flex flex-row ${notice.pinned ? "bg-blue-50" : ""}`}
      onClick={handleNoticeClick}
    >
      <div className="w-16 text-center">{notice.id}</div>
      <div className="w-24 text-center flex justify-center">
        {renderTypeBadge(notice.type)}
      </div>
      <div className="flex-1 text-left pl-4 md:pl-20 lg:pl-40 min-w-0">
        <div
          className="truncate w-full overflow-hidden text-ellipsis whitespace-nowrap"
          title={notice.title}
        >
          {notice.pinned && (
            <span className="text-blue-600 font-bold mr-2">[공지]</span>
          )}
          {truncateTitle(notice.title)}
        </div>
      </div>
      <div className="flex-1 text-center">{notice.writer}</div>
      <div className="w-28 text-center">{formatDate(notice.registedAt)}</div>
    </div>
  );
};

export default PageRow;
