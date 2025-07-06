import React, { useState, useEffect } from "react";
import { surveyPageFetch } from "../services/survey/surveyFetch";
import GenericPage from "../components/common/GenericPage";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import { surveyConfig } from "../util/surveyUtil";

// 설문 응답 타입 정의
interface SurveyResponse {
  content: Array<{
    surveyId: string;
    status: string;
    className: string;
    title: string;
    questionCount: number;
    responseRate: string;
    dueDate: string;
    createdAt: string;
  }>;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 반응형 size 계산 함수
const getResponsiveSize = (): number => {
  const width = window.innerWidth;
  if (width < 768) return 5; // mobile
  if (width < 1024) return 8; // tablet
  return 10; // desktop
};

const Survey: React.FC = () => {
  const [surveyList, setSurveyList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(getResponsiveSize());
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const { fetchData } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const handleResize = () => {
      setSize(getResponsiveSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchSurveyList();
  }, [page, size]);

  const fetchSurveyList = async () => {
    try {
      setLoading(true);
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = (await fetchData(() =>
        surveyPageFetch(page, size, token)
      )) as SurveyResponse;
      setSurveyList(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("설문 목록 조회 실패:", error);
      alert("설문 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
  };

  if (loading) {
    return <Loading text="설문 목록을 불러오는 중..." />;
  }

  return (
    <GenericPage
      dataList={surveyList}
      page={page}
      size={size}
      totalPages={totalPages}
      totalElements={totalElements}
      onPageChange={handlePageChange}
      onSizeChange={handleSizeChange}
      onDelete={undefined}
      onRowClick={undefined}
      config={surveyConfig as any}
    />
  );
};

export default Survey;
