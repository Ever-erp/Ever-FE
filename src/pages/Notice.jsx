import SearchBar from "../components/specific/notice/SearchBar";
import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import { useState, useEffect } from "react";
import {
  noticePageFetch,
  noticeSearchFetch,
} from "../services/notice/noticeFetch";
import GenericPage from "../components/common/GenericPage";

const Notice = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  // SearchBar컴포넌트에서 검색버튼을 눌렀을 때 setSearch 변경
  const handleSearchChange = (searchChange) => {
    setSearch(searchChange).then(() => {
      noticeSearchFetch(category, search).then((res) => {
        setNoticeList(res.content);
      });
    });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSizeChange = (size) => {
    setSize(size);
  };

  useEffect(() => {
    noticePageFetch(page, size).then((res) => {
      setNoticeList(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
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
      id: "noticeId",
      type: "type",
      title: "title",
      writer: "writer",
      createdAt: "createdAt",
    },
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-row items-center w-full h-1/5 justify-center pt-20">
        <CategorySelectBar onCategoryChange={handleCategoryChange} />
        <SearchBar onSearchChange={handleSearchChange} />
      </div>
      <div className="flex flex-row items-center justify-center w-full h-4/5">
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
      </div>
    </div>
  );
};

export default Notice;
