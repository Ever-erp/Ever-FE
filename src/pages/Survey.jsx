import SearchBar from "../components/specific/notice/SearchBar";
import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import { useState, useEffect } from "react";
import GenericPage from "../components/common/GenericPage";
import SurveyViewer from "../components/specific/survey/SurveyViewer";
import SurveyResponseViewer from "../components/specific/survey/SurveyResponseViewer";
import {
  surveyPageFetch,
  surveyDeleteMultipleFetch,
} from "../services/survey/surveyFetch";
import { surveyConfig } from "../util/surveyUtil";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import { useSelector } from "react-redux";

const Survey = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [surveyList, setSurveyList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list", "survey", "response"
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [currentMode, setCurrentMode] = useState("survey"); // "survey" 또는 "response"

  const user = useSelector((state) => state.user.user);
  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const categoryOptions = [
    [
      { value: "all", label: "제목 전체" },
      { value: "title", label: "제목" },
    ],
  ];

  const handleSearchChange = (searchChange) => {
    setSearch(searchChange);
    // TODO: 설문 검색 API 호출
    console.log("설문 검색:", searchChange);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSizeChange = (size) => {
    setSize(size);
  };

  const handleSurveyStatusClick = () => {
    setCurrentMode("survey");
  };

  const handleResponseStatusClick = () => {
    setCurrentMode("response");
  };

  // 행 클릭 핸들러
  const handleRowClick = (item) => {
    setSelectedSurveyId(item.surveyId);
    setViewMode(currentMode); // "survey" 또는 "response"
  };

  // 뷰어에서 목록으로 돌아가기
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedSurveyId(null);
  };

  const handleDeleteSurveys = async (surveyIds) => {
    try {
      setLoading(true);
      await surveyDeleteMultipleFetch(surveyIds, token);
      alert(`${surveyIds.length}개의 설문이 성공적으로 삭제되었습니다.`);

      const res = await surveyPageFetch(page, size, token);
      const processedSurveyList = res.content.map((survey) => {
        const responseRate =
          survey.classTotalMemberCount > 0
            ? Math.round(
                (survey.answeredCount / survey.classTotalMemberCount) * 100
              )
            : 0;

        return {
          ...survey,
          responseRate: `${responseRate}% (${survey.answeredCount}/${survey.classTotalMemberCount})`,
        };
      });

      setSurveyList(processedSurveyList);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error("설문 삭제 오류:", error);
      alert("설문 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 유저 권한이면 해당 유저가 갖고있는 설문 리스트 페이지형태로 받음
    // 관리자 권한이면 모든 설문 리스트 페이지형태로 받음
    setLoading(true);
    surveyPageFetch(page, size, token)
      .then((res) => {
        const processedSurveyList = res.content.map((survey) => {
          const responseRate =
            survey.classTotalMemberCount > 0
              ? Math.round(
                  (survey.answeredCount / survey.classTotalMemberCount) * 100
                )
              : 0;

          return {
            ...survey,
            responseRate: `${responseRate}% (${survey.answeredCount}/${survey.classTotalMemberCount})`,
          };
        });

        setSurveyList(processedSurveyList);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
        setLoading(false);
      })
      .catch((error) => {
        console.error("설문 목록 조회 오류:", error);
        setLoading(false);
      });
  }, [page, size]);

  // 리스트 뷰
  if (viewMode === "list") {
    return (
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row items-center w-full h-full justify-center pb-5">
              <CategorySelectBar
                onCategoryChange={handleCategoryChange}
                categoryOptions={categoryOptions}
              />
              <SearchBar onSearchChange={handleSearchChange} />
            </div>
            {user.position === "관리자" && (
              <div className="flex flex-row items-center justify-start w-full gap-2 ml-40 pb-3">
                <button
                  className={`w-[80px] h-[30px] rounded-xl text-white ${
                    currentMode === "survey"
                      ? "bg-blue-700"
                      : "bg-brand hover:bg-blue-600"
                  }`}
                  onClick={handleSurveyStatusClick}
                >
                  설문 현황
                </button>
                <button
                  className={`w-[80px] h-[30px] rounded-xl text-white ${
                    currentMode === "response"
                      ? "bg-blue-700"
                      : "bg-brand hover:bg-blue-600"
                  }`}
                  onClick={handleResponseStatusClick}
                >
                  응답 현황
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <Loading text="데이터를 불러오고 있습니다..." />
          ) : (
            <div className="flex flex-row items-center justify-center w-full h-full">
              <GenericPage
                dataList={surveyList}
                page={page}
                size={size}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={handlePageChange}
                onSizeChange={handleSizeChange}
                onDelete={handleDeleteSurveys}
                onRowClick={handleRowClick}
                config={surveyConfig}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (user.position === "학생") {
    return (
      <div className="h-full w-full">
        <SurveyViewer surveyId={selectedSurveyId} mode="user" />
      </div>
    );
  }
  // 설문 현황 뷰 (기존 SurveyViewer)
  if (user.position === "관리자" && viewMode === "survey") {
    return (
      <div className="h-full w-full">
        <SurveyViewer
          surveyId={selectedSurveyId}
          mode="admin"
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  // 응답 현황 뷰 (새로운 SurveyResponseViewer)
  if (user.position === "관리자" && viewMode === "response") {
    return (
      <div className="h-full w-full">
        <SurveyResponseViewer
          surveyId={selectedSurveyId}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  return null;
};

export default Survey;
