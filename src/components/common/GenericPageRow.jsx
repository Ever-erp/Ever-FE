import React from "react";
import { useNavigate } from "react-router-dom";
import { parsedDate } from "../../util/surveyUtil";
const GenericPageRow = ({ data, config, onRowClick }) => {
  const navigate = useNavigate();

  /*
    ALL_TARGETRANGE,    // 전체
    WEB_APP,            // 웹/앱
    SMART_FACTORY,      // 스마트 팩토리
    SW_EMBEDDED,        // SW 임베디드
    IT_SECURITY,        // IT 보안
    CLOUD  
  */
  const handleType = (type) => {
    switch (type) {
      case "ALL_TYPE":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            전체
          </div>
        );
      case "WEB_APP":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            웹/앱
          </div>
        );
      case "SMART_FACTORY":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            스마트 팩토리
          </div>
        );
      case "SW_EMBEDDED":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            임베디드
          </div>
        );
      case "IT_SECURITY":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            IT 보안
          </div>
        );
      case "CLOUD":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            클라우드
          </div>
        );
      case "NOTICE":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            공지
          </div>
        );
      case "SURVEY":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            설문
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-1 md:px-2 py-1 md:py-2 text-xs font-medium">
            {type}
          </div>
        );
    }
  };

  const handleClassName = (className) => {
    switch (className) {
      case "전체":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            전체
          </div>
        );
      case "웹앱":
        return (
          <div className="text-blue-600 border border-blue-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            웹앱
          </div>
        );
      case "임베디드":
        return (
          <div className="text-purple-600 border border-purple-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            임베
          </div>
        );
      case "IT보안":
        return (
          <div className="text-red-600 border border-red-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            보안
          </div>
        );
      case "스마트팩토리":
        return (
          <div className="text-orange-600 border border-orange-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[50px] md:w-[60px]">
            팩토리
          </div>
        );
      case "클라우드":
        return (
          <div className="text-indigo-600 border border-indigo-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[60px] md:w-[70px]">
            클라우드
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            {className}
          </div>
        );
    }
  };

  const handleSurveyStatus = (status) => {
    switch (status) {
      case "진행중":
        return (
          <div className="text-green-600 border border-green-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            진행
          </div>
        );
      case "완료":
        return (
          <div className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            완료
          </div>
        );
      case "작성중":
        return (
          <div className="text-yellow-600 border border-yellow-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            작성
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            {status}
          </div>
        );
    }
  };

  const handleRowClick = () => {
    if (onRowClick) {
      // 커스텀 행 클릭 핸들러가 있으면 사용
      onRowClick(data);
    } else {
      // 기본 동작: 상세 페이지로 이동
      const id = data[config.dataKeyMapping.id];
      navigate(`${config.detailRoute}/${id}`);
    }
  };

  const renderCellContent = (column, data) => {
    let value = data[config.dataKeyMapping[column.key]];

    if (column.key === "id" && value.length > 5) {
      value = value.slice(0, 5);
    }

    switch (column.render) {
      case "badge":
        return handleType(value);
      case "status":
        return handleSurveyStatus(value);
      case "className":
        return handleClassName(value);
      case "responseRate":
        return (
          <div className="text-blue-600 font-medium text-sm">
            {value || "0% (0/0)"}
          </div>
        );

      default:
        // 제목 컬럼인 경우 텍스트 오버플로우 처리
        if (column.key === "title") {
          return (
            <div className="truncate w-full" title={value}>
              {value || "-"}
            </div>
          );
        }
        if (column.key === "registedAt") {
          return parsedDate(value);
        }
        return value || "-";
    }
  };

  return (
    <div className="flex flex-row items-center w-full" onClick={handleRowClick}>
      {config.columns.map((column, index) => (
        <div
          key={index}
          className={`${column.width} text-${
            column.align
          } text-xs md:text-sm lg:text-base ${
            column.paddingLeft
              ? column.paddingLeft.replace("pl-40", "pl-4 md:pl-20 lg:pl-40")
              : ""
          } ${
            column.key === "title"
              ? "flex justify-start min-w-0 overflow-hidden flex-shrink"
              : "flex justify-center flex-shrink-0"
          }`}
        >
          {renderCellContent(column, data)}
        </div>
      ))}
    </div>
  );
};

export default GenericPageRow;
