import React from "react";
import { useNavigate } from "react-router-dom";
import { parsedDate, isDateExpired } from "../../util/surveyUtil";

interface GenericPageRowProps {
  data: any;
  config: any;
  onRowClick?: (data: any) => void;
}

const GenericPageRow: React.FC<GenericPageRowProps> = ({
  data,
  config,
  onRowClick,
}) => {
  const navigate = useNavigate();

  /*
    ALL_TARGETRANGE,    // 전체
    WEB_APP,            // 웹/앱
    SMART_FACTORY,      // 스마트 팩토리
    SW_EMBEDDED,        // SW 임베디드
    IT_SECURITY,        // IT 보안
    CLOUD  
  */
  const handleType = (type: string) => {
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

  const handleClassName = (className: string) => {
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

  const handleSurveyStatus = (status: string, dueDate: string) => {
    // 마감일이 지났으면 상태를 "종료"로 변경
    if (dueDate && isDateExpired(dueDate)) {
      return (
        <div className="text-gray-600 border border-gray-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
          종료
        </div>
      );
    }

    switch (status) {
      case "진행중":
        return (
          <div className="text-green-600 border border-green-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            진행
          </div>
        );
      case "완료":
        return (
          <div className="text-blue-600 border border-blue-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
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

  const renderCellContent = (column: any, data: any) => {
    let value = data[config.dataKeyMapping[column.key]];

    if (column.key === "id" && value.length > 5) {
      value = value.slice(0, 5);
    }

    switch (column.render) {
      case "badge":
        return handleType(value);
      case "status":
        // 마감일 정보도 함께 전달
        const dueDate = data[config.dataKeyMapping.targetDate];
        return handleSurveyStatus(value, dueDate);
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
          const truncateText = (text: string, maxLength?: number): string => {
            if (!text) return "-";

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

            const responsiveMaxLength = maxLength || getResponsiveMaxLength();

            if (text.length <= responsiveMaxLength) return text;
            return text.substring(0, responsiveMaxLength) + "...";
          };

          return (
            <div
              className="truncate w-full overflow-hidden text-ellipsis whitespace-nowrap"
              title={value}
              style={{ maxWidth: "100%" }}
            >
              {truncateText(value)}
            </div>
          );
        }
        if (column.key === "registedAt") {
          // 날짜 형식 변환 (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
          const formatDate = (dateString: string): string => {
            if (!dateString) return "-";
            return dateString.split(" ")[0]; // 날짜 부분만 추출
          };
          return formatDate(value);
        }
        if (column.key === "targetDate") {
          // 마감일 형식 변환
          const formatDate = (dateString: string): string => {
            if (!dateString) return "-";
            return dateString.split(" ")[0]; // 날짜 부분만 추출
          };
          return formatDate(value);
        }
        return value || "-";
    }
  };

  return (
    <div className="flex flex-row items-center w-full" onClick={handleRowClick}>
      {config.columns.map((column: any, index: number) => (
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
              ? "flex justify-start min-w-0 overflow-hidden"
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
