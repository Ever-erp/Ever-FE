import SearchBar from "../components/specific/notice/SearchBar";
import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import { useState, useEffect } from "react";
import {
  noticePageFetch,
  noticeSearchFetch,
} from "../services/notice/noticeFetch";
import GenericPage from "../components/common/GenericPage";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";

const Notice = () => {
  const [category, setCategory] = useState({
    targetRange: "ALL_TARGETRANGE",
    type: "ALL_TYPE",
  });
  const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuthFetch();

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    console.log("선택된 카테고리:", selectedCategory);
  };

  const categoryOptions = [
    [
      { value: "ALL_TARGETRANGE", label: "반 전체" },
      { value: "WEB_APP", label: "웹/앱" },
      { value: "SW_EMBEDDED", label: "임베디드" },
      { value: "IT_SECURITY", label: "보안" },
      { value: "SMART_FACTORY", label: "스마트팩토리" },
      { value: "CLOUD_SECURITY", label: "클라우드" },
    ],
    [
      { value: "ALL_TYPE", label: "타입 전체" },
      { value: "NOTICE", label: "공지" },
      { value: "SURVEY", label: "설문" },
    ],
  ];

  // SearchBar컴포넌트에서 검색버튼을 눌렀을 때 setSearch 변경
  const handleSearchChange = async (searchChange) => {
    setSearch(searchChange);

    const targetRangeAndType = {
      targetRange: category?.targetRange || "ALL_TARGETRANGE",
      type: category?.type || "ALL_TYPE",
    };

    const token = localStorage.getItem("accessToken");
    try {
      const res = await noticeSearchFetch(
        targetRangeAndType.targetRange,
        targetRangeAndType.type,
        searchChange,
        page,
        size,
        token
      );

      console.log("검색 결과:", res);

      // 검색 결과 데이터 구조 확인 후 상태 업데이트
      if (res && res.content) {
        setNoticeList(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } else if (res) {
        // res가 직접 배열인 경우
        setNoticeList(res);
        setTotalPages(1);
        setTotalElements(res.length);
      }
    } catch (error) {
      console.error("검색 오류:", error);
      setNoticeList([]);
      setTotalPages(0);
      setTotalElements(0);
    }
  };

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
      // API 응답 구조에 맞게 데이터 추출
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

  // 공지사항 설정
  const noticeConfig = {
    title: "게시글",
    writeButtonText: "글 쓰기",
    writeRoute: "/notice/write",
    detailRoute: "/notice",
    showWriteButton: true,
    columns: [
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
      { key: "createdAt", label: "게시일", width: "w-28", align: "center" },
    ],
    dataKeyMapping: {
      id: "id",
      type: "type",
      title: "title",
      writer: "writer",
      createdAt: "targetDate", // API 응답에서는 targetDate 필드 사용
    },
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-row items-center w-full justify-center pb-10">
        <CategorySelectBar
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
        />
        <SearchBar onSearchChange={handleSearchChange} />
      </div>
      <div className="flex flex-row items-center justify-center w-full">
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
