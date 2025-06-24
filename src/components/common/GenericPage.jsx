import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageFooter from "../specific/notice/PageFooter";
import GenericPageRow from "./GenericPageRow";

const GenericPage = ({
  dataList,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,

  config = {
    title: "게시글", // "게시글" or "설문"
    writeButtonText: "글 쓰기", // "글 쓰기" or "설문 작성"
    writeRoute: "/notice/write", // 작성 페이지 경로
    detailRoute: "/notice", // 상세 페이지 경로
    showWriteButton: true, // 작성버튼 표시 (true / false)
    columns: [
      // 컬럼 관련설정
      { key: "id", label: "번호", width: "w-16", align: "center" },
      {
        key: "type",
        label: "구분",
        width: "w-24",
        align: "center",
        render: "badge",
      },
      {
        key: "title",
        label: "제목",
        width: "flex-1",
        align: "left",
        paddingLeft: "pl-40",
      },
      { key: "writer", label: "작성자", width: "flex-1", align: "center" },
      { key: "memberCount", label: "참여자", width: "w-28", align: "center" },
      { key: "createdAt", label: "게시일", width: "w-28", align: "center" },
    ],
    dataKeyMapping: {
      // 데이터 필드 매핑
      id: "noticeId", // or "surveyId"
      type: "type", // 설문의경우 type을 설정하지않음.
      status: "status", // 공지의경우 status를 설정하지않음.
      title: "title",
      memberCount: "memberCount", // 설문의 경우 memberCount를 설정하지않음.
      questionCount: "questionCount", // 공지의 경우 questionCount를 설정하지않음.
      writer: "writer", // 설문의 경우 writer를 설정하지않음.
      dueDate: "dueDate",
      createdAt: "createdAt",
    },
  },
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
    navigate(config.writeRoute);
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
        총 <span className="text-brand font-semibold">{totalElements}</span>개의
        {config.title}이 있습니다.
      </div>
      {/* 헤더 */}
      <div className="flex w-full border-t-4 border-brand pt-5 border-b pb-5 pl-10 pr-10">
        {config.columns.map((column, index) => (
          <div
            key={index}
            className={`${column.width} text-${column.align} font-semibold ${
              column.paddingLeft || ""
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>
      {/* Row */}
      <div className="flex flex-col">
        {dataList && dataList.length > 0 ? (
          dataList.map((item, index) => (
            <div
              key={`${config.title}-${
                item[config.dataKeyMapping.id] || item.id || index
              }`}
              className="border-b border-gray-300 pb-3 pt-3 pl-10 pr-10 hover:bg-gray-100"
              style={{ cursor: "pointer" }}
            >
              <GenericPageRow data={item} config={config} />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {config.title}이 없습니다.
          </div>
        )}
      </div>
      {/* 작성버튼 */}
      {config.showWriteButton && (
        <div className="flex justify-end gap-4 mt-5">
          <button
            className="bg-brand text-white px-10 py-2 rounded-md hover:bg-brand/80 transition-colors"
            onClick={handleWriteClick}
          >
            {config.writeButtonText}
          </button>
        </div>
      )}
      {/* 페이지네이션 */}
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

export default GenericPage;
