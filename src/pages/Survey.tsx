// import SearchBar from "../components/specific/notice/SearchBar";
// import CategorySelectBar from "../components/specific/notice/CategorySelectBar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericPage from "../components/common/GenericPage";
import {
  surveyPageFetch,
  surveyDeleteMultipleFetch,
} from "../services/survey/surveyFetch";
import { surveyConfig } from "../util/surveyUtil";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import { useSelector, useDispatch } from "react-redux";
import {
  setAdminSurveyClick,
  getAdminSurveyClick,
  resetSurveyState,
} from "../store/surveySlice";
import { SurveyItemWithRate, AdminSurveyMode } from "../types/survey";

interface RootState {
  user: {
    user: {
      name: string;
      position: string;
    };
  };
  survey: any;
}

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [category, setCategory] = useState("all");
  // const [search, setSearch] = useState("");
  const [surveyList, setSurveyList] = useState<SurveyItemWithRate[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

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

  const user = useSelector((state: RootState) => state.user.user);
  const surveyState = useSelector((state: RootState) => state.survey); // 전체 survey 상태를 가져옴
  const currentMode: AdminSurveyMode =
    useSelector((state: RootState) => state.survey?.adminSurveyClick) ||
    "survey";
  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  // 디버깅을 위한 로그 추가
  useEffect(() => {
  }, [currentMode, surveyState]);

  // 컴포넌트 마운트 시 Redux 상태 확인 및 초기화
  useEffect(() => {
    try {
      // 상태가 문자열이거나 올바르지 않은 형태라면 초기화
      if (
        typeof surveyState === "string" ||
        !surveyState ||
        typeof surveyState !== "object"
      ) {
        console.warn("Survey state is corrupted, resetting...");
        dispatch(resetSurveyState());

        // localStorage도 정리 (필요시)
        const persistedState = localStorage.getItem("persist:root");
        if (persistedState) {
          try {
            const parsed = JSON.parse(persistedState);
            if (
              typeof parsed.survey === "string" &&
              parsed.survey !== '"survey"'
            ) {
              console.warn("Cleaning up corrupted localStorage");
              // localStorage의 survey 부분만 초기화
              parsed.survey = JSON.stringify({
                surveyRedirect: null,
                adminSurveyClick: "survey",
              });
              localStorage.setItem("persist:root", JSON.stringify(parsed));
            }
          } catch (e) {
            console.error("Error parsing localStorage:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error checking survey state:", error);
      dispatch(resetSurveyState());
    }
  }, [dispatch, surveyState]);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const newSize = getResponsiveSize();
      if (newSize !== size) {
        setSize(newSize);
        setPage(1); // 사이즈 변경 시 첫 페이지로 이동
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
  //     { value: "all", label: "제목 전체" },
  //     { value: "title", label: "제목" },
  //   ],
  // ];

  // const handleSearchChange = (searchChange) => {
  //   setSearch(searchChange);
  //   // TODO: 설문 검색 API 호출

  // };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSizeChange = (size: number) => {
    setSize(size);
  };

  const handleSurveyStatusClick = () => {
    dispatch(setAdminSurveyClick("survey"));
  };

  const handleResponseStatusClick = () => {
    dispatch(setAdminSurveyClick("response"));
  };

  // 상태 변경 확인을 위한 useEffect 추가
  useEffect(() => {}, [currentMode]);

  // 행 클릭 핸들러 - 라우팅으로 변경
  const handleRowClick = (item: SurveyItemWithRate) => {
    if (currentMode === "survey") {
      // 설문 현황 보기
      navigate(`/survey/${item.surveyId}`);
    } else {
      // 응답 현황 보기 - 쿼리 파라미터로 모드 전달
      navigate(`/survey/${item.surveyId}?mode=response`);
    }
  };

  const handleDeleteSurveys = async (surveyIds: string[]) => {
    try {
      setLoading(true);
      await surveyDeleteMultipleFetch(surveyIds, token!);
      alert(`${surveyIds.length}개의 설문이 성공적으로 삭제되었습니다.`);

      const res = await surveyPageFetch(page, size, token!);
      const processedSurveyList: SurveyItemWithRate[] = res.content.map(
        (survey) => {
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
        }
      );

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
    if (!token) return;

    setLoading(true);
    surveyPageFetch(page, size, token)
      .then((res) => {
        console.log("API 응답 데이터:", res.content[0]); // 첫 번째 항목 로그 출력
        console.log("className:", res.content[0]?.className);
        console.log("createdAt:", res.content[0]?.createdAt);
        console.log("dueDate:", res.content[0]?.dueDate);
        const processedSurveyList: SurveyItemWithRate[] = res.content.map(
          (survey) => {
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
          }
        );

        setSurveyList(processedSurveyList);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
        setLoading(false);
      })
      .catch((error) => {
        console.error("설문 목록 조회 오류:", error);
        setLoading(false);
      });
  }, [page, size, token]);

  return (
    <div className="flex flex-col items-center w-full h-full px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col md:flex-row items-center w-full h-full justify-center pb-5 gap-4 md:gap-0">
            {/* <CategorySelectBar
              onCategoryChange={handleCategoryChange}
              categoryOptions={categoryOptions}
            />
            <SearchBar onSearchChange={handleSearchChange} /> */}
          </div>
          {user.position === "ROLE_관리자" && (
            <div className="flex flex-row items-center justify-start w-full gap-2 pb-3 md:ml-40">
              <button
                className={`w-[80px] h-[30px] rounded-xl text-white text-sm md:text-base ${
                  currentMode === "survey"
                    ? "bg-blue-700"
                    : "bg-brand hover:bg-blue-600"
                }`}
                onClick={handleSurveyStatusClick}
              >
                설문 현황
              </button>
              <button
                className={`w-[80px] h-[30px] rounded-xl text-white text-sm md:text-base ${
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
};

export default Survey;
