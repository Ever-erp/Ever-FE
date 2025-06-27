import React from "react";
import { useNavigate } from "react-router-dom";
const PageRow = ({ notice }) => {
  const navigate = useNavigate();

  const handleType = (type) => {
    switch (type) {
      case "일반":
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-2 py-2 text-xs font-medium">
            일반
          </div>
        );
      case "설문":
        return (
          <div className="text-brand border border-brand rounded-md px-2 py-2 text-xs font-medium">
            설문
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-2 py-2 text-xs font-medium">
            {type}
          </div>
        );
    }
  };

  const handleNoticeClick = () => {
    navigate(`/notice/${notice.noticeId}`);
  };

  return (
    <div className="flex flex-row" onClick={handleNoticeClick}>
      <div className="w-16 text-center">{notice.noticeId}</div>
      <div className="w-24 text-center flex justify-center">
        {handleType(notice.type)}
      </div>
      <div className="flex-1 text-left pl-40">{notice.title}</div>
      <div className="flex-1 text-center">{notice.writer}</div>
      <div className="w-28 text-center">{notice.createdAt}</div>
    </div>
  );
};

export default PageRow;
