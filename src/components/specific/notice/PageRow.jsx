import React from "react";
import { useNavigate } from "react-router-dom";
const PageRow = ({ notice }) => {
  const navigate = useNavigate();

  const handleNoticeClick = () => {
    navigate(`/notice/${notice.noticeId}`);
  };

  return (
    <div className="flex flex-row" onClick={handleNoticeClick}>
      <div className="w-16 text-center">{notice.noticeId}</div>
      <div className="w-24 text-center flex justify-center">{notice.type}</div>
      <div className="flex-1 text-left pl-40">{notice.title}</div>
      <div className="flex-1 text-center">{notice.writer}</div>
      <div className="w-28 text-center">{notice.createdAt}</div>
    </div>
  );
};

export default PageRow;
