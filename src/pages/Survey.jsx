import SearchBar from "../components/specific/notice/SearchBar";
import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import { useState, useEffect } from "react";
import GenericPage from "../components/common/GenericPage";
import { surveyPageFetch } from "../services/survey/surveyFetch";
import { surveyConfig } from "../util/surveyUtil";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
const Survey = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [surveyList, setSurveyList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);

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
    console.log("설문 현황");
  };

  const handleResponseStatusClick = () => {
    console.log("응답 현황");
  };

  useEffect(() => {
    // 유저 권한이면 해당 유저가 갖고있는 설문 리스트 페이지형태로 받음
    // 관리자 권한이면 모든 설문 리스트 페이지형태로 받음
    setLoading(true);
    surveyPageFetch(page, size, token).then((res) => {
      setSurveyList(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    });
    setLoading(false);
  }, [page, size]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-row items-center w-full h-1/5 justify-center pt-20">
        <CategorySelectBar
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
        />
        <SearchBar onSearchChange={handleSearchChange} />
      </div>
      {loading ? (
        <Loading text="데이터를 불러오고 있습니다..." />
      ) : (
        <div className="flex flex-row items-center justify-center w-full h-4/5">
          <GenericPage
            dataList={surveyList}
            page={page}
            size={size}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
            config={surveyConfig}
          />
        </div>
      )}
      <div className="flex flex-row items-center justify-center w-full h-1/5">
        <button
          className="w-[150px] h-[50px] bg-brand text-white rounded-xl"
          onClick={handleSurveyStatusClick}
        >
          설문 현황
        </button>
        <button
          className="w-[150px] h-[50px] bg-brand text-white rounded-xl"
          onClick={handleResponseStatusClick}
        >
          응답 현황
        </button>
      </div>
    </div>
  );
};

export default Survey;
