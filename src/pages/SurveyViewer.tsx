import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import {
  singleSurveyFetch,
  surveySubmitFetch,
  findSurveyBySurveyIdAndMemberIdFetch,
  surveySubmitUpdateFetch,
} from "../services/survey/surveyFetch";
import {
  SurveyItem,
  SurveyUserResponse,
  SurveyQuestion as SurveyQuestionType,
} from "../types/survey";

interface UserAnswer {
  questionId: string;
  answer: string;
}

const SurveyViewer: React.FC = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  const [surveyData, setSurveyData] = useState<SurveyItem | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasExistingResponse, setHasExistingResponse] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!surveyId || !token) {
        return;
      }

      try {
        // 설문 데이터 가져오기
        const survey: SurveyItem = await singleSurveyFetch(surveyId, token);
        setSurveyData(survey);

        // 기존 응답 확인
        try {
          const existingResponse: SurveyUserResponse =
            await findSurveyBySurveyIdAndMemberIdFetch(surveyId, token);

          if (existingResponse) {
            setHasExistingResponse(true);
            // 기존 답변으로 초기화
            const existingAnswers: UserAnswer[] = existingResponse.answers.map(
              (answer) => ({
                questionId: answer.questionId,
                answer: answer.answer,
              })
            );
            setUserAnswers(existingAnswers);
          } else {
            // 새로운 응답 초기화
            const initialAnswers: UserAnswer[] = survey.questions.map((q) => ({
              questionId: q.id,
              answer: "",
            }));
            setUserAnswers(initialAnswers);
          }
        } catch (error) {
          // 기존 응답이 없는 경우 (404 등)
          const initialAnswers: UserAnswer[] = survey.questions.map((q) => ({
            questionId: q.id,
            answer: "",
          }));
          setUserAnswers(initialAnswers);
        }
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
        alert("설문 데이터를 불러오는데 실패했습니다.");
        navigate("/survey");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [surveyId, token, navigate]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) =>
      prev.map((userAnswer) =>
        userAnswer.questionId === questionId
          ? { ...userAnswer, answer }
          : userAnswer
      )
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    // 필수 답변 검증
    const unansweredQuestions = userAnswers.filter(
      (answer) => !answer.answer.trim()
    );

    if (unansweredQuestions.length > 0) {
      alert("모든 문항에 답변해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        surveyId: surveyId!,
        answers: userAnswers,
      };

      let response;
      if (hasExistingResponse) {
        response = await surveySubmitUpdateFetch(submitData, token!);
      } else {
        response = await surveySubmitFetch(submitData, token!);
      }

      if (response.status === 200 || response.status === 201) {
        alert(
          hasExistingResponse
            ? "설문 응답이 성공적으로 수정되었습니다."
            : "설문 응답이 성공적으로 제출되었습니다."
        );
        navigate("/survey");
      } else {
        alert("설문 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("설문 제출 오류:", error);
      alert("설문 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/survey");
  };

  const getCurrentAnswer = (questionId: string): string => {
    const answer = userAnswers.find((a) => a.questionId === questionId);
    return answer ? answer.answer : "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">설문 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">설문을 찾을 수 없습니다.</div>
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
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
            {surveyData.className}
          </span>
          <h1 className="text-xl font-semibold text-gray-800 flex-1">
            {surveyData.title}
          </h1>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
            {hasExistingResponse ? "수정중" : "응답중"}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">{surveyData.description}</p>
        </div>

        <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
          <div>
            마감일: {new Date(surveyData.targetDate).toLocaleDateString()}
          </div>
          <div>
            응답: {surveyData.answeredCount}/{surveyData.memberCount}
          </div>
        </div>
      </div>

      {/* 설문 문항들 - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto px-8 min-h-0">
        <div className="space-y-6 pb-4">
          {surveyData.questions.map(
            (question: SurveyQuestionType, index: number) => (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border"
              >
                {/* 문항 헤더 */}
                <div className="bg-gradient-to-r from-brand to-subBrand text-white p-4 rounded-t-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{index + 1}번 문항:</span>
                    <span className="flex-1">{question.question}</span>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                      {question.type === "MULTIPLE_CHOICE"
                        ? "객관식"
                        : "주관식"}
                    </span>
                  </div>
                </div>

                {/* 문항 내용 */}
                <div className="p-6">
                  {question.type === "MULTIPLE_CHOICE" ? (
                    <div className="space-y-3">
                      {question.options?.map(
                        (option: string, optionIndex: number) => (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={getCurrentAnswer(question.id) === option}
                              onChange={(e) =>
                                handleAnswerChange(question.id, e.target.value)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={getCurrentAnswer(question.id)}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        placeholder="답변을 입력해주세요..."
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* 하단 버튼들 - 고정 */}
      <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className={`px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? "제출 중..."
            : hasExistingResponse
            ? "응답 수정"
            : "응답 제출"}
        </button>
      </div>
    </div>
  );
};

export default SurveyViewer;
