import React, { useState, useEffect } from "react";
import {
  noticePageFetch,
  noticeSearchFetch,
} from "../services/notice/noticeFetch";
import Page from "../components/specific/notice/Page";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import SearchBar from "../components/specific/notice/SearchBar";
import { NoticeItem, SearchType, TargetRange } from "../types/notice";

interface CategoryState {
  targetRange: TargetRange;
  type: SearchType;
}

const Notice: React.FC = () => {
  const [category, setCategory] = useState<CategoryState>({
    targetRange: "ALL_TARGETRANGE",
    type: "ALL_CATEGORY",
  });
  const [search, setSearch] = useState<string>("");
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  // 화면 크기에 따른 페이징 사이즈 계산
  const getResponsiveSize = (): number => {
    const width = window.innerWidth;
    if (width >= 2560) return 20; // 2560px 이상 데스크탑
    if (width >= 1920) return 14; // 1920px 이상 데스크탑
    if (width >= 1600) return 10; // 1440px 이상 데스크탑
    if (width >= 1024) return 8; // 1024px 이상 랩탑
    if (width >= 768) return 6; // 768px 이상 아이패드
    return 6; // 768px 미만
  };

  const [size, setSize] = useState<number>(() => getResponsiveSize());
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleCategoryChange = (selectedCategory: CategoryState | string) => {
    if (typeof selectedCategory === "string") {
      // 단일 카테고리 선택의 경우 (Survey 페이지용)
      return;
    }
    setCategory(selectedCategory);
  };

  const categoryOptions = [
    [
      { value: "ALL_TARGETRANGE", label: "대상 범위 전체" },
      { value: "WEB_APP", label: "웹/앱" },
      { value: "SMART_FACTORY", label: "스마트팩토리" },
      { value: "SW_EMBEDDED", label: "SW/임베디드" },
      { value: "IT_SECURITY", label: "IT보안" },
      { value: "CLOUD", label: "클라우드" },
    ],
    [
      { value: "ALL_CATEGORY", label: "타입 전체" },
      { value: "NOTICE", label: "공지사항" },
      { value: "SURVEY", label: "설문조사" },
    ],
  ];

  // SearchBar컴포넌트에서 검색버튼을 눌렀을 때 setSearch 변경
  const handleSearchChange = async (searchChange: string) => {
    setSearch(searchChange);

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await noticeSearchFetch(
        category.type,
        searchChange,
        page,
        size,
        token
      );

      // 검색 결과 데이터 구조 확인 후 상태 업데이트
      if (res && res.content) {
        setNoticeList(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } else if (res) {
        // res가 직접 배열인 경우 (타입 안전성을 위해 체크)
        const resArray = Array.isArray(res) ? res : [];
        setNoticeList(resArray);
        setTotalPages(1);
        setTotalElements(resArray.length);
      }
    } catch (error) {
      console.error("검색 오류:", error);
      setNoticeList([]);
      setTotalPages(0);
      setTotalElements(0);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSizeChange = (size: number) => {
    setSize(size);
  };

  useEffect(() => {}, [noticeList]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await noticePageFetch(page, size, token);
        if (res && res.content) {
          setNoticeList(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        }
      } catch (error) {
        console.error("공지사항 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  return (
    <div className="flex flex-col w-full h-full px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="flex-shrink-0 flex flex-col md:flex-row items-center w-full justify-center pb-10 gap-4 md:gap-0">
        <CategorySelectBar
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
        />
        <SearchBar onSearchChange={handleSearchChange} />
      </div>
      <div className="flex-1 flex flex-row items-center justify-center w-full min-h-0">
        {loading ? (
          <div className="flex flex-row items-center justify-center w-full h-full">
            <Loading text="로딩중..." />
          </div>
        ) : (
          <Page
            noticeList={noticeList}
            page={page}
            size={size}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default Notice;
