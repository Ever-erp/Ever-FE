import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { transformDataForAPI, getTodayString } from "../util/surveyUtil";
import {
  surveyUpdateFetch,
  singleSurveyFetch,
} from "../services/survey/surveyFetch";
import CustomDropdown from "../components/common/CustomDropdown";
import {
  SurveyWriteData,
  SurveyQuestion,
  ClassName,
  SurveyItem,
} from "../types/survey";

interface DropdownOption {
  value: ClassName;
  label: string;
}

const SurveyEdit: React.FC = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const targetRangeOptions: DropdownOption[] = [
    { value: "웹앱", label: "웹/앱" },
    { value: "임베디드", label: "임베디드" },
    { value: "IT보안", label: "보안" },
    { value: "스마트팩토리", label: "스마트팩토리" },
    { value: "클라우드", label: "클라우드" },
  ];

  const [surveyData, setSurveyData] = useState<SurveyWriteData>({
    title: "",
    description: "",
    endDate: "",
    className: "웹앱",
    questions: [],
  });

  // 기존 설문 데이터 불러오기
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId || !token) {
        return;
      }

      try {
        const data: SurveyItem = await singleSurveyFetch(surveyId, token);

        const transformedQuestions: SurveyQuestion[] = data.questions.map(
          (q, index) => ({
            id: index + 1,
            type: q.type === "MULTIPLE_CHOICE" ? "객관식" : "주관식",
            question: q.question,
            options:
              q.type === "MULTIPLE_CHOICE" && q.options
                ? q.options
                : q.type === "SHORT_ANSWER"
                ? []
                : [""],
          })
        );

        setSurveyData({
          title: data.title,
          description: data.description,
          endDate: data.targetDate.split("T")[0], // ISO 날짜에서 날짜 부분만 추출
          className: data.className,
          questions: transformedQuestions,
        });
      } catch (error) {
        console.error("설문 데이터 로딩 오류:", error);
        alert("설문 데이터를 불러오는데 실패했습니다.");
        navigate("/survey");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId, token, navigate]);

  // 문항 추가 (특정 문항 아래에)
  const addQuestion = (afterIndex: number) => {
    const newQuestion: SurveyQuestion = {
      id: Date.now(),
      type: "객관식",
      question: "",
      options: [""],
    };
    const newQuestions = [...surveyData.questions];
    newQuestions.splice(afterIndex + 1, 0, newQuestion);

    setSurveyData({
      ...surveyData,
      questions: newQuestions,
    });
  };

  // 문항 삭제
  const removeQuestion = (questionId: number) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.filter((q) => q.id !== questionId),
    });
  };

  // 문항 내용 수정
  const updateQuestion = (
    questionId: number,
    field: keyof SurveyQuestion,
    value: string
  ) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    });
  };

  // 문항 타입 변경
  const changeQuestionType = (
    questionId: number,
    type: "객관식" | "주관식"
  ) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              type,
              options:
                type === "객관식"
                  ? q.options.length > 0
                    ? q.options
                    : [""]
                  : [],
            }
          : q
      ),
    });
  };

  // 선택지 추가
  const addOption = (questionId: number) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      ),
    });
  };

  // 선택지 삭제
  const removeOption = (questionId: number, optionIndex: number) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, index) => index !== optionIndex),
            }
          : q
      ),
    });
  };

  // 선택지 내용 수정
  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
            }
          : q
      ),
    });
  };

  // 설문 저장
  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!surveyData.title.trim()) {
      alert("설문 제목을 입력해주세요.");
      return;
    }

    if (!surveyData.description.trim()) {
      alert("설문 설명을 입력해주세요.");
      return;
    }

    if (!surveyData.endDate) {
      alert("마감일을 선택해주세요.");
      return;
    }

    for (let i = 0; i < surveyData.questions.length; i++) {
      const question = surveyData.questions[i];
      if (!question.question.trim()) {
        alert(`${i + 1}번 문항의 질문을 입력해주세요.`);
        return;
      }

      if (question.type === "객관식") {
        const validOptions = question.options.filter(
          (option) => option.trim() !== ""
        );
        if (validOptions.length < 2) {
          alert(`${i + 1}번 문항은 최소 2개의 선택지가 필요합니다.`);
          return;
        }
      }
    }

    const apiData = transformDataForAPI(surveyData);

    try {
      setIsSaving(true);
      const response = await surveyUpdateFetch(surveyId!, apiData, token!);

      if (response.status === 200) {
        alert("설문이 성공적으로 수정되었습니다.");
        navigate("/survey");
      } else {
        alert("설문 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("설문 수정 오류:", error);
      alert("설문 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 취소
  const handleCancel = () => {
    if (isSaving) {
      return;
    }
    navigate("/survey");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">설문 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-full bg-gray-50 overflow-hidden"
      style={{ height: "80vh" }}
    >
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 p-8 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <CustomDropdown
            options={targetRangeOptions}
            value={surveyData.className}
            onChange={(value: ClassName) =>
              setSurveyData({ ...surveyData, className: value })
            }
            placeholder="대상 선택"
            width="w-32"
          />
          <input
            type="text"
            value={surveyData.title}
            onChange={(e) =>
              setSurveyData({ ...surveyData, title: e.target.value })
            }
            placeholder="설문 제목을 입력하세요"
            className="text-gray-600 border-b border-gray-300 px-2 py-1 flex-1"
          />
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
            수정중
          </span>
        </div>

        <div className="mb-4">
          <textarea
            value={surveyData.description}
            onChange={(e) =>
              setSurveyData({ ...surveyData, description: e.target.value })
            }
            placeholder="설문 설명을 입력하세요"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm">마감일:</label>
            <input
              type="date"
              value={surveyData.endDate}
              min={getTodayString()}
              onChange={(e) =>
                setSurveyData({ ...surveyData, endDate: e.target.value })
              }
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="text-gray-600 text-sm">응답: 0/25</div>
        </div>
      </div>

      {/* 설문 문항들 - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto px-8 min-h-0">
        <div className="space-y-6 pb-4">
          {surveyData.questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border"
            >
              {/* 문항 헤더 */}
              <div className="bg-gradient-to-r from-brand to-subBrand text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-white hover:bg-blue-700 rounded px-2 py-1"
                  >
                    ✕
                  </button>
                  <span>{questionIndex + 1}번 문항:</span>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, "question", e.target.value)
                    }
                    placeholder="질문을 입력하세요"
                    className="bg-transparent border-b border-white/50 text-white placeholder-white/70 px-2 py-1 flex-1 min-w-0"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeQuestionType(question.id, "객관식")}
                    className={`px-3 py-1 rounded text-sm ${
                      question.type === "객관식"
                        ? "bg-white text-blue-600"
                        : "bg-blue-500 hover:bg-blue-700"
                    }`}
                  >
                    객관식
                  </button>
                  <button
                    onClick={() => changeQuestionType(question.id, "주관식")}
                    className={`px-3 py-1 rounded text-sm ${
                      question.type === "주관식"
                        ? "bg-white text-blue-600"
                        : "bg-blue-500 hover:bg-blue-700"
                    }`}
                  >
                    주관식
                  </button>
                </div>
              </div>

              {/* 문항 내용 */}
              <div className="p-4">
                {question.type === "객관식" ? (
                  <div className="space-y-3">
                    {/* 왼쪽 + 버튼 (문항 추가) */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => addQuestion(questionIndex)}
                        className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                      >
                        +
                      </button>

                      {/* 선택지들 */}
                      <div className="flex-1 space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <span className="text-gray-500">
                              {optionIndex + 1}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              placeholder="선택지를 입력하세요"
                            />
                          </div>
                        ))}
                      </div>

                      {/* 오른쪽 +/- 버튼들 (선택지 관리) */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => addOption(question.id)}
                          className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            removeOption(
                              question.id,
                              question.options.length - 1
                            )
                          }
                          disabled={question.options.length <= 1}
                          className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-red-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 주관식
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => addQuestion(questionIndex)}
                      className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                    >
                      +
                    </button>
                    <div className="flex-1 text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                      주관식
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼들 - 고정 */}
      <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className={`px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 ${
            isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          수정 취소
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "저장 중..." : "설문 수정"}
        </button>
      </div>
    </div>
  );
};

export default SurveyEdit;
