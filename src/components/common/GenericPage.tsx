import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageFooter from "../specific/notice/PageFooter";
import GenericPageRow from "./GenericPageRow";
import { useSelector } from "react-redux";
const GenericPage = ({
  dataList,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
  onDelete,
  onRowClick,

  config = {
    title: "게시글", // "게시글" or "설문"
    writeButtonText: "글 쓰기", // "글 쓰기" or "설문 작성"
    writeRoute: "/notice/write", // 작성 페이지 경로
    detailRoute: "/notice", // 상세 페이지 경로
    showWriteButton: true, // 작성버튼 표시 (true / false)
    showDeleteButton: false,
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
      {
        key: "targetDate",
        label: "공지 게시일",
        width: "w-28",
        align: "center",
      },
      { key: "registedAt", label: "게시일", width: "w-28", align: "center" },
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
      targetDate: "targetDate",
      createdAt: "registedAt",
    },
  },
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(page);
  const [currentSize, setCurrentSize] = useState(size);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const user = useSelector((state) => state.user.user);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size) => {
    setCurrentSize(size);
  };

  const handleWriteClick = () => {
    navigate(config.writeRoute);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = dataList.map((item) => item[config.dataKeyMapping.id]);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    const confirmMessage = `선택된 ${selectedItems.length}개의 ${config.title}을(를) 삭제하시겠습니까?`;
    if (window.confirm(confirmMessage)) {
      onDelete && onDelete(selectedItems);
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [dataList]);

  useEffect(() => {
    if (dataList && dataList.length > 0) {
      setSelectAll(selectedItems.length === dataList.length);
    }
  }, [selectedItems, dataList]);

  useEffect(() => {
    onPageChange(currentPage);
    onSizeChange(currentSize);
    handlePageChange(page);
    handleSizeChange(size);
  }, [currentPage, currentSize]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center px-4 md:px-8 lg:px-12 xl:px-20">
      <div className="flex flex-col w-full h-full">
        <div className="text-gray-500 pb-2 text-sm md:text-base">
          총 <span className="text-brand font-semibold">{totalElements}</span>
          개의
          {config.title}이 있습니다.
        </div>
        {/* 헤더 */}
        <div className="flex w-full border-t-4 border-brand pt-3 md:pt-5 border-b pb-3 md:pb-5 px-2 md:px-6 lg:px-10">
          {config.showDeleteButton && user.position === "ROLE_관리자" && (
            <div className="w-8 md:w-12 text-center font-semibold text-sm md:text-base flex-shrink-0">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-3 h-3 md:w-4 md:h-4"
              />
            </div>
          )}
          {config.columns.map((column, index) => (
            <div
              key={index}
              className={`${column.width} text-${
                column.align
              } font-semibold text-xs md:text-sm lg:text-base ${
                column.paddingLeft
                  ? column.paddingLeft.replace(
                      "pl-40",
                      "pl-4 md:pl-20 lg:pl-40"
                    )
                  : ""
              } ${
                column.key === "title" ? "flex-shrink min-w-0" : "flex-shrink-0"
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
                className={`border-b border-gray-300 pb-2 md:pb-3 pt-2 md:pt-3 px-2 md:px-6 lg:px-10 cursor-pointer ${
                  item.pinned
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  {config.showDeleteButton &&
                    user.position === "ROLE_관리자" && (
                      <div className="w-8 md:w-12 flex justify-center flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(
                            item[config.dataKeyMapping.id]
                          )}
                          onChange={() =>
                            handleSelectItem(item[config.dataKeyMapping.id])
                          }
                          className="w-3 h-3 md:w-4 md:h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  <div className="flex-1 min-w-0">
                    <GenericPageRow
                      data={item}
                      config={config}
                      onRowClick={onRowClick}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm md:text-base">
              {config.title}이 없습니다.
            </div>
          )}
        </div>
        {/* 버튼들 */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-5 gap-4 md:gap-0">
          {user.position === "ROLE_관리자" && (
            <>
              <div>
                {config.showDeleteButton && selectedItems.length > 0 && (
                  <button
                    className="bg-red-500 text-white px-4 md:px-6 py-2 rounded-md hover:bg-red-600 transition-colors text-sm md:text-base"
                    onClick={handleDeleteSelected}
                  >
                    선택 삭제 ({selectedItems.length})
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {config.showWriteButton && (
                  <button
                    className="bg-brand text-white px-6 md:px-10 py-2 rounded-md hover:bg-brand/80 transition-colors text-sm md:text-base"
                    onClick={handleWriteClick}
                  >
                    {config.writeButtonText}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        {/* 페이지네이션 */}
        <div className="flex justify-center w-full h-full">
          <PageFooter
            currentPage={currentPage}
            totalPageLength={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
