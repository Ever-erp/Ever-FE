import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageFooter from "./PageFooter";
import PageRow from "./PageRow";
import { NoticeItem } from "../../../types/notice";

interface PageProps {
  noticeList: NoticeItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

const Page: React.FC<PageProps> = ({
  noticeList,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [currentSize, setCurrentSize] = useState<number>(size);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size: number) => {
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
    <div className="flex flex-col w-full h-auto mx-auto max-w-7xl px-4">
      <div className="text-gray-500 pb-3 text-sm">
        총 <span className="text-brand font-semibold">{totalElements}</span>개의
        게시글이 있습니다.
      </div>
      <div className="flex w-full border-t-4 border-brand border-b px-6 min-h-[60px] items-center bg-gray-50">
        <div className="w-16 text-center font-semibold text-sm flex-shrink-0">
          번호
        </div>
        <div className="w-24 text-center font-semibold text-sm flex-shrink-0">
          구분
        </div>
        <div className="flex-1 text-center font-semibold text-sm pl-20 min-w-0">
          제목
        </div>
        <div className="flex-1 text-center font-semibold text-sm flex-shrink-0 px-2">
          작성자
        </div>
        <div className="w-28 text-center font-semibold text-sm flex-shrink-0">
          게시일
        </div>
      </div>
      <div className="flex flex-col bg-white rounded-lg shadow-sm">
        {noticeList && noticeList.length > 0 ? (
          noticeList.map((notice, index) => (
            <div
              key={`notice-${notice.id || index}`}
              className="border-b border-gray-200 px-6 hover:bg-gray-50 transition-colors duration-200 min-h-[50px] flex items-center"
              style={{ cursor: "pointer" }}
            >
              <PageRow notice={notice} />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
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
