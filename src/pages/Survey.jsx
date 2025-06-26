import SearchBar from "../components/specific/notice/SearchBar";
import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import { useState, useEffect } from "react";
import GenericPage from "../components/common/GenericPage";
import { surveyPageFetch } from "../services/survey/surveyFetch";
import { surveyConfig } from "../util/surveyUtil";
const Survey = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [surveyList, setSurveyList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

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

  useEffect(() => {
    // 유저 권한이면 해당 유저가 갖고있는 설문 리스트 페이지형태로 받음
    // 관리자 권한이면 모든 설문 리스트 페이지형태로 받음
    surveyPageFetch(page, size).then((res) => {
      setSurveyList(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    });
  }, [page, size]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-row items-center w-full h-1/5 justify-center pt-20">
        <CategorySelectBar onCategoryChange={handleCategoryChange} />
        <SearchBar onSearchChange={handleSearchChange} />
      </div>
      <div className="flex flex-row items-center justify-center w-full h-1/5">
        <button className="w-[150px] h-[50px] bg-brand text-white rounded-xl">
          설문 현황
        </button>
        <button className="w-[150px] h-[50px] bg-brand text-white rounded-xl">
          응답 현황
        </button>
      </div>
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
    </div>
  );
};

export default Survey;
