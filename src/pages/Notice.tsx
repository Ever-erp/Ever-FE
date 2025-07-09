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
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false); // 검색 모드 상태 추가
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  // 화면 크기에 따른 페이징 사이즈 계산
  const getResponsiveSize = (): number => {
    const width = window.innerWidth;
    if (width >= 2560) return 12; // 2560px 이상 데스크탑
    if (width >= 1920) return 10; // 1920px 이상 데스크탑
    if (width >= 1600) return 8; // 1440px 이상 데스크탑
    if (width >= 1024) return 6; // 1024px 이상 랩탑
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
      // Notice 페이지에서 검색 타입 변경 처리
      setCategory((prevCategory) => ({
        ...prevCategory,
        type: selectedCategory as SearchType,
      }));
      return;
    }

    // CategoryState 객체 처리 (현재는 사용하지 않음)
    setCategory(selectedCategory);
  };

  const categoryOptions = [
    [
      { value: "ALL_CATEGORY", label: "타입 전체" },
      { value: "WRITER", label: "작성자" },
      { value: "TITLE", label: "제목" },
    ],
  ];

  // SearchBar컴포넌트에서 검색버튼을 눌렀을 때 setSearch 변경
  const handleSearchChange = async (searchChange: string) => {
    setSearch(searchChange);

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // 빈 검색어일 때는 검색 모드 해제하고 일반 목록 로드
    if (!searchChange.trim()) {
      setIsSearchMode(false);
      setPage(0);
      try {
        const res = await noticePageFetch(0, size, token);
        if (res && res.content) {
          setNoticeList(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        }
      } catch (error) {
        console.error("공지사항 로딩 오류:", error);
      }
      return;
    }

    // 검색 모드 활성화
    setIsSearchMode(true);
    setPage(0);
    try {
      const res = await noticeSearchFetch(
        category.type,
        searchChange,
        0, // 검색 시 항상 첫 페이지부터 시작
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
      // 검색 모드일 때는 일반 목록을 로드하지 않음
      if (isSearchMode) return;

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
  }, [page, size, isSearchMode]); // isSearchMode 의존성 추가

  return (
    <div className="flex flex-col w-full h-full px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="flex-shrink-0 flex flex-col md:flex-row items-center w-full justify-center pt-20 gap-4 md:gap-0">
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
