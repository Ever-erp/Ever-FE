import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageFooter from "./PageFooter";
import PageRow from "./PageRow";

const Page = ({
  noticeList,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(page);
  const [currentSize, setCurrentSize] = useState(size);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size) => {
    setCurrentSize(size);
  };

  const handleWriteClick = () => {
    navigate("/notice/write");
  };

  useEffect(() => {
    onPageChange(currentPage);
    onSizeChange(currentSize);
    handlePageChange(page);
    handleSizeChange(size);
  }, [currentPage, currentSize]);

  return (
    <div className="flex flex-col w-full h-auto mr-20 ml-20">
      <div className="text-gray-500 pb-2">
        총 <a className="text-brand font-semibold">{totalElements}</a>개의
        게시글이 있습니다.
      </div>
      <div className="flex w-full border-t-4 border-brand pt-5 border-b pb-5 pl-10 pr-10">
        <div className="w-16 text-center font-semibold">번호</div>
        <div className="w-24 text-center font-semibold">구분</div>
        <div className="flex-1 text-center font-semibold pl-40">제목</div>
        <div className="flex-1 text-center font-semibold">작성자</div>
        <div className="w-28 text-center font-semibold">게시일</div>
      </div>
      <div className="flex flex-col">
        {noticeList && noticeList.length > 0 ? (
          noticeList.map((notice, index) => (
            <div
              key={`notice-${notice.noticeId || notice.id || index}`}
              className="border-b border-gray-300 pb-3 pt-3 pl-10 pr-10 hover:bg-gray-100"
              style={{ cursor: "pointer" }}
            >
              <PageRow notice={notice} />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            게시글이 없습니다.
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-5">
        <button
          className="bg-brand text-white px-10 py-2 rounded-md hover:bg-brand/80 transition-colors"
          onClick={handleWriteClick}
        >
          글 쓰기
        </button>
      </div>
      <div className="flex justify-center">
        <PageFooter
          currentPage={currentPage}
          totalPageLength={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Page;
