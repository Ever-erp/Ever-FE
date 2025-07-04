// import SearchBar from "../components/specific/notice/SearchBar";
// import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import React, { useState, useEffect } from "react";
import {
  noticePageFetch,
  // noticeSearchFetch,
} from "../services/notice/noticeFetch";
import GenericPage from "../components/common/GenericPage";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import { noticeConfig } from "../util/noticeUtil";

const Notice = () => {
  // const [category, setCategory] = useState({
  //   targetRange: "ALL_TARGETRANGE",
  //   type: "ALL_TYPE",
  // });
  // const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);

  // 화면 크기에 따른 페이징 사이즈 계산
  const getResponsiveSize = () => {
    const width = window.innerWidth;
    if (width >= 2560) return 20; // 2560px 이상 데스크탑
    if (width >= 1920) return 14; // 1920px 이상 데스크탑
    if (width >= 1600) return 10; // 1440px 이상 데스크탑
    if (width >= 1024) return 8; // 1024px 이상 랩탑
    if (width >= 768) return 6; // 768px 이상 아이패드
    return 6; // 768px 미만
  };

  const [size, setSize] = useState(() => getResponsiveSize());
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuthFetch();

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const newSize = getResponsiveSize();
      if (newSize !== size) {
        setSize(newSize);
        setPage(0); // 사이즈 변경 시 첫 페이지로 이동 (Notice는 0부터 시작)
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  // const handleCategoryChange = (selectedCategory) => {
  //   setCategory(selectedCategory);
  // };

  // const categoryOptions = [
  //   [
  //     { value: "ALL_TARGETRANGE", label: "반 전체" },
  //     { value: "WEB_APP", label: "웹/앱" },
  //     { value: "SW_EMBEDDED", label: "임베디드" },
  //     { value: "IT_SECURITY", label: "보안" },
  //     { value: "SMART_FACTORY", label: "스마트팩토리" },
  //     { value: "CLOUD_SECURITY", label: "클라우드" },
  //   ],
  //   [
  //     { value: "ALL_TYPE", label: "타입 전체" },
  //     { value: "NOTICE", label: "공지" },
  //     { value: "SURVEY", label: "설문" },
  //   ],
  // ];

  // // SearchBar컴포넌트에서 검색버튼을 눌렀을 때 setSearch 변경
  // const handleSearchChange = async (searchChange) => {
  //   setSearch(searchChange);

  //   const targetRangeAndType = {
  //     targetRange: category?.targetRange || "ALL_TARGETRANGE",
  //     type: category?.type || "ALL_TYPE",
  //   };

  //   const token = localStorage.getItem("accessToken");
  //   try {
  //     const res = await noticeSearchFetch(
  //       targetRangeAndType.targetRange,
  //       targetRangeAndType.type,
  //       searchChange,
  //       page,
  //       size,
  //       token
  //     );

  //     // 검색 결과 데이터 구조 확인 후 상태 업데이트
  //     if (res && res.content) {
  //       setNoticeList(res.content);
  //       setTotalPages(res.totalPages);
  //       setTotalElements(res.totalElements);
  //     } else if (res) {
  //       // res가 직접 배열인 경우
  //       setNoticeList(res);
  //       setTotalPages(1);
  //       setTotalElements(res.length);
  //     }
  //   } catch (error) {
  //     console.error("검색 오류:", error);
  //     setNoticeList([]);
  //     setTotalPages(0);
  //     setTotalElements(0);
  //   }
  // };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSizeChange = (size) => {
    setSize(size);
  };

  useEffect(() => {}, [noticeList]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    noticePageFetch(page, size, token).then((res) => {
      if (res && res.content) {
        setNoticeList(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      }
      setLoading(false);
    });
    handlePageChange(page);
    handleSizeChange(size);
  }, [page, size]);

  return (
    <div className="flex flex-col w-full h-full px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="flex-shrink-0 flex flex-col md:flex-row items-center w-full justify-center pb-10 gap-4 md:gap-0">
        {/* <CategorySelectBar
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
        />
        <SearchBar onSearchChange={handleSearchChange} /> */}
      </div>
      <div className="flex-1 flex flex-row items-center justify-center w-full min-h-0">
        {loading ? (
          <div className="flex flex-row items-center justify-center w-full h-full">
            <Loading text="로딩중..." />
          </div>
        ) : (
          <GenericPage
            dataList={noticeList}
            page={page}
            size={size}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
            config={noticeConfig}
          />
        )}
      </div>
    </div>
  );
};

export default Notice;
