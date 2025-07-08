import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  singleSurveyFetch,
  surveyUpdateFetch,
  surveyDeleteFetch,
  surveySubmitFetch,
  surveySubmitUpdateFetch,
} from "../../../services/survey/surveyFetch";
import {
  getStatusBadgeColor,
  parsedDate,
  isDateExpired,
} from "../../../util/surveyUtil";
import { useAuthFetch } from "../../../hooks/useAuthFetch";
import Loading from "../../common/Loading";

const SurveyViewer = ({
  surveyId,
  mode = "view", // "view", "admin", "submit", "edit"
  existingAnswers = null, // 기존 답변이 있다면 기존답변 (edit mode)
  onSave,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(
    mode === "submit" || mode === "edit"
  );
  const [answers, setAnswers] = useState([]); // 답변 저장 상태관리
  const [isLoading, setIsLoading] = useState(false);
  const [surveyData, setSurveyData] = useState({
    surveyId: "",
    surveyTitle: "",
    surveyDesc: "",
    dueDate: "",
    status: "",
    surveySize: 0,
    createdAt: "",
    surveyQuestion: [],
    surveyQuestionMeta: [],
    surveyAnswer: null,
  });

  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    setIsLoading(true);
    singleSurveyFetch(surveyId, token)
      .then((res) => {
        setSurveyData(res);
        if (mode === "submit" || mode === "edit" || mode === "user") {
          let initialAnswers = new Array(res.surveyQuestion?.length || 0).fill(
            ""
          );

          // mode가 "user"이고 surveyAnswer가 있는 경우 기존 답변 사용
          if (
            mode === "user" &&
            res.surveyAnswer &&
            res.surveyAnswer.length > 0
          ) {
            initialAnswers = res.surveyAnswer.map((answer, index) => {
              // 객관식 질문인지 확인 - 빈 배열이 아니면 객관식
              if (
                res.surveyQuestionMeta &&
                res.surveyQuestionMeta[index] &&
                res.surveyQuestionMeta[index].length > 0
              ) {
                // 객관식인 경우 1부터를 0부터로 변환
                const numAnswer = parseInt(answer);
                if (!isNaN(numAnswer) && numAnswer > 0) {
                  return (numAnswer - 1).toString();
                }
              }
              // 주관식일 경우 그대로 반환
              return answer;
            });
          } else if (existingAnswers) {
            initialAnswers = existingAnswers.map((answer, index) => {
              // 객관식 질문인지 확인 - 빈 배열이 아니면 객관식
              if (
                res.surveyQuestionMeta &&
                res.surveyQuestionMeta[index] &&
                res.surveyQuestionMeta[index].length > 0
              ) {
                // 객관식인 경우 1부터를 0부터로 변환
                const numAnswer = parseInt(answer);
                if (!isNaN(numAnswer) && numAnswer > 0) {
                  return (numAnswer - 1).toString();
                }
              }
              // 주관식일 경우 그대로 반환
              return answer;
            });
          }
          setAnswers(initialAnswers);
        }
      })
      .catch((error) => {
        console.error("SurveyViewer - API 호출 오류:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [surveyId, mode, existingAnswers]);

  // 주관식 질문인지 확인
  const isSubjectiveQuestion = (questionIndex) => {
    if (
      !surveyData.surveyQuestionMeta ||
      !surveyData.surveyQuestionMeta[questionIndex]
    ) {
      return false;
    }
    // 빈 배열이면 주관식
    return surveyData.surveyQuestionMeta[questionIndex].length === 0;
  };

  // 답변 업데이트 (사용자 모드)
  const updateAnswer = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  // 문항 추가 (관리자 모드)
  const addQuestion = (afterIndex) => {
    const newQuestions = [...surveyData.surveyQuestion];
    const newQuestionMeta = [...surveyData.surveyQuestionMeta];

    newQuestions.splice(afterIndex + 1, 0, "");
    newQuestionMeta.splice(afterIndex + 1, 0, ["옵션1", "옵션2"]); // 기본값은 객관식

    setSurveyData({
      ...surveyData,
      surveyQuestion: newQuestions,
      surveyQuestionMeta: newQuestionMeta,
      surveySize: newQuestions.length,
    });
  };

  // 문항 삭제 (관리자 모드)
  const removeQuestion = (questionIndex) => {
    const newQuestions = [...surveyData.surveyQuestion];
    const newQuestionMeta = [...surveyData.surveyQuestionMeta];

    newQuestions.splice(questionIndex, 1);
    newQuestionMeta.splice(questionIndex, 1);

    setSurveyData({
      ...surveyData,
      surveyQuestion: newQuestions,
      surveyQuestionMeta: newQuestionMeta,
      surveySize: newQuestions.length,
    });
  };

  // 문항 내용 수정 (관리자 모드)
  const updateQuestion = (questionIndex, value) => {
    const newQuestions = [...surveyData.surveyQuestion];
    newQuestions[questionIndex] = value;

    setSurveyData({
      ...surveyData,
      surveyQuestion: newQuestions,
    });
  };

  // 문항 타입 변경 (관리자 모드)
  const changeQuestionType = (questionIndex, type) => {
    const newQuestionMeta = [...surveyData.surveyQuestionMeta];

    if (type === "주관식") {
      newQuestionMeta[questionIndex] = []; // 빈 배열로 설정
    } else {
      newQuestionMeta[questionIndex] = ["옵션1", "옵션2"]; // 객관식 기본 옵션
    }

    setSurveyData({
      ...surveyData,
      surveyQuestionMeta: newQuestionMeta,
    });
  };

  // 선택지 추가 (관리자 모드)
  const addOption = (questionIndex) => {
    const newQuestionMeta = [...surveyData.surveyQuestionMeta];
    const currentOptions = [...newQuestionMeta[questionIndex]];
    currentOptions.push(`옵션${currentOptions.length + 1}`);
    newQuestionMeta[questionIndex] = currentOptions;

    setSurveyData({
      ...surveyData,
      surveyQuestionMeta: newQuestionMeta,
    });
  };

  // 선택지 삭제 (관리자 모드)
  const removeOption = (questionIndex, optionIndex) => {
    const newQuestionMeta = [...surveyData.surveyQuestionMeta];
    const currentOptions = [...newQuestionMeta[questionIndex]];
    currentOptions.splice(optionIndex, 1);
    newQuestionMeta[questionIndex] = currentOptions;

    setSurveyData({
      ...surveyData,
      surveyQuestionMeta: newQuestionMeta,
    });
  };

  // 선택지 내용 수정 (관리자 모드)
  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestionMeta = [...surveyData.surveyQuestionMeta];
    const currentOptions = [...newQuestionMeta[questionIndex]];
    currentOptions[optionIndex] = value;
    newQuestionMeta[questionIndex] = currentOptions;

    setSurveyData({
      ...surveyData,
      surveyQuestionMeta: newQuestionMeta,
    });
  };

  // 설문 저장/수정 (관리자 모드)
  const handleAdminSave = async () => {
    try {
      await surveyUpdateFetch(surveyData.surveyId, surveyData, token);
      alert("설문이 성공적으로 저장되었습니다.");
      setIsEditing(false);
      if (onSave) onSave();
    } catch (error) {
      console.error("설문 저장 중 오류:", error);
      alert("설문 저장 중 오류가 발생했습니다.");
    }
  };

  // 설문 제출/수정 (사용자 모드)
  const handleSubmit = async () => {
    const unansweredQuestions = answers.some((answer, index) => {
      if (!answer || answer.trim() === "") {
        return true;
      }
      return false;
    });

    if (unansweredQuestions) {
      alert("모든 질문에 답변해주세요.");
      return;
    }

    try {
      // 서버 전송용 답변 파싱
      const convertedAnswers = answers.map((answer, index) => {
        // 객관식 질문인지 확인
        if (
          surveyData.surveyQuestionMeta &&
          surveyData.surveyQuestionMeta[index] &&
          surveyData.surveyQuestionMeta[index].length > 0
        ) {
          // 객관식인 경우 0부터를 1부터로 변환
          const numAnswer = parseInt(answer);
          if (!isNaN(numAnswer)) {
            return (numAnswer + 1).toString();
          }
        }
        // 주관식일경우 그대로 반환
        return answer;
      });

      const submitData = {
        surveyId: surveyData.surveyId,
        answers: convertedAnswers,
      };

      if (mode === "edit") {
        // 수정 모드
        await surveySubmitUpdateFetch(surveyData.surveyId, submitData, token);
        alert("설문 답변이 성공적으로 수정되었습니다.");
      } else {
        // 신규 제출 모드
        await surveySubmitFetch(surveyData.surveyId, submitData, token);
        alert("설문이 성공적으로 제출되었습니다.");
      }

      if (onSave) onSave();
    } catch (error) {
      console.error("설문 제출 중 오류:", error);
      alert("설문 제출 중 오류가 발생했습니다.");
    }
  };

  // 설문 삭제 (관리자 모드)
  const handleDelete = async () => {
    if (window.confirm("정말로 이 설문을 삭제하시겠습니까?")) {
      try {
        await surveyDeleteFetch(surveyData.surveyId, token);
        alert("설문이 성공적으로 삭제되었습니다.");
        navigate("/survey");
        if (onCancel) onCancel();
      } catch (error) {
        console.error("설문 삭제 중 오류:", error);
        alert("설문 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleModify = () => {
    navigate(`/survey/${surveyId}/submit`);
  };

  // 취소
  const handleCancel = () => {
    if (mode === "admin" && isEditing) {
      setIsEditing(false);
      // 원래 데이터로 복원
      setIsLoading(true);
      singleSurveyFetch(surveyId, token)
        .then((res) => {
          setSurveyData(res);
        })
        .catch((error) => {
          console.error("데이터 복원 중 오류:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      if (onCancel) onCancel();
    }
  };

  // 관리자 편집 모드 체크
  const isAdminEditing = mode === "admin" && isEditing;
  const isUserMode = mode === "submit" || mode === "edit";
  const isViewMode = mode === "view" || mode === "user"; // user 모드도 읽기 전용으로 처리
  const isExpired = isDateExpired(surveyData.dueDate); // 마감일 확인

  // 클래스명 표시 함수 (GenericPageRow의 handleClassName과 동일)
  const handleClassName = (className: string) => {
    switch (className) {
      case "전체":
        return (
          <span className="text-brand border border-brand rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            전체
          </span>
        );
      case "웹앱":
        return (
          <span className="text-blue-600 border border-blue-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            웹앱
          </span>
        );
      case "임베디드":
        return (
          <span className="text-purple-600 border border-purple-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            임베
          </span>
        );
      case "IT보안":
        return (
          <span className="text-red-600 border border-red-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            보안
          </span>
        );
      case "스마트팩토리":
        return (
          <span className="text-orange-600 border border-orange-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[50px] md:w-[60px]">
            팩토리
          </span>
        );
      case "클라우드":
        return (
          <span className="text-indigo-600 border border-indigo-600 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[60px] md:w-[70px]">
            클라우드
          </span>
        );
      default:
        return (
          <span className="text-gray-500 border border-gray-300 rounded-md px-1 md:px-2 py-1 text-xs font-medium w-[30px] md:w-[40px]">
            {className}
          </span>
        );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="flex flex-col w-full bg-gray-50 overflow-hidden"
      style={{ height: "80vh" }}
    >
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 p-8 pb-4">
        <div className="flex items-center gap-2 mb-4">
          {handleClassName(surveyData.className)}
          <span className="text-gray-600 font-medium">
            {surveyData.surveyTitle}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(
              surveyData.status
            )}`}
          >
            {surveyData.status}
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-gray-600 text-sm">
            <span className="font-medium">설명:</span>{" "}
            {surveyData.surveyDesc || "설명 없음"}
          </div>
          <div className="text-gray-600 text-sm">
            <span className="font-medium">마감일:</span> {surveyData.dueDate}
          </div>
          <div className="text-gray-600 text-sm">
            <span className="font-medium">생성일:</span>{" "}
            {parsedDate(surveyData.createdAt)}
          </div>
        </div>

        <div className="text-gray-600 text-sm">
          {isUserMode
            ? `총 ${surveyData.surveySize || 0}개 문항`
            : mode === "user"
            ? `내 답변 확인 - 총 ${surveyData.surveySize || 0}개 문항`
            : `응답: 0/${surveyData.surveySize || 0}`}
        </div>

        {isUserMode && (
          <div className="mt-2 text-sm text-blue-600">
            * 모든 문항에 답변해주세요.
            {mode === "edit" && (
              <span className="block text-amber-600">
                * 기존 답변을 수정하고 있습니다.
              </span>
            )}
          </div>
        )}

        {mode === "user" && (
          <div className="mt-2 text-sm text-green-600">
            * 제출한 답변을 확인하고 있습니다.
          </div>
        )}
      </div>

      {/* 설문 문항들 - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto px-8 min-h-0">
        <div className="space-y-6 pb-4">
          {surveyData.surveyQuestion &&
            surveyData.surveyQuestion.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-white rounded-lg shadow-sm border"
              >
                {/* 문항 헤더 */}
                <div className="bg-gradient-to-r from-brand to-subBrand text-white p-4 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isAdminEditing && (
                      <button
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-white hover:bg-blue-700 rounded px-2 py-1"
                      >
                        ✕
                      </button>
                    )}
                    <span>{questionIndex + 1}번 문항:</span>
                    {isAdminEditing ? (
                      <input
                        type="text"
                        value={question}
                        onChange={(e) =>
                          updateQuestion(questionIndex, e.target.value)
                        }
                        placeholder="질문을 입력하세요"
                        className="bg-transparent border-b border-white/50 text-white placeholder-white/70 px-2 py-1 flex-1 min-w-0"
                      />
                    ) : (
                      <span className="flex-1">{question}</span>
                    )}
                  </div>
                  {isAdminEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          changeQuestionType(questionIndex, "객관식")
                        }
                        className={`px-3 py-1 rounded text-sm ${
                          !isSubjectiveQuestion(questionIndex)
                            ? "bg-white text-blue-600"
                            : "bg-blue-500 hover:bg-blue-700"
                        }`}
                      >
                        객관식
                      </button>
                      <button
                        onClick={() =>
                          changeQuestionType(questionIndex, "주관식")
                        }
                        className={`px-3 py-1 rounded text-sm ${
                          isSubjectiveQuestion(questionIndex)
                            ? "bg-white text-blue-600"
                            : "bg-blue-500 hover:bg-blue-700"
                        }`}
                      >
                        주관식
                      </button>
                    </div>
                  )}
                </div>

                {/* 문항 내용 */}
                <div className="p-4">
                  {!isSubjectiveQuestion(questionIndex) ? (
                    <div className="space-y-3">
                      {/* 관리자 모드 - 문항 관리 */}
                      <div className="flex items-center gap-4">
                        {isAdminEditing && (
                          <button
                            onClick={() => addQuestion(questionIndex)}
                            className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                          >
                            +
                          </button>
                        )}

                        {/* 선택지들 */}
                        <div className="flex-1 space-y-2">
                          {surveyData.surveyQuestionMeta[questionIndex] &&
                            surveyData.surveyQuestionMeta[questionIndex].map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center gap-2"
                                >
                                  {isUserMode ? (
                                    // 사용자 모드 - 라디오 버튼
                                    <>
                                      <input
                                        type="radio"
                                        name={`question_${questionIndex}`}
                                        value={optionIndex}
                                        checked={
                                          answers[questionIndex] ===
                                          optionIndex.toString()
                                        }
                                        onChange={(e) =>
                                          updateAnswer(
                                            questionIndex,
                                            e.target.value
                                          )
                                        }
                                        className="w-4 h-4 text-blue-600"
                                      />
                                      <span className="flex-1">{option}</span>
                                    </>
                                  ) : mode === "user" ? (
                                    // 사용자 답변 보기 모드 - 읽기 전용
                                    <>
                                      <input
                                        type="radio"
                                        name={`question_${questionIndex}`}
                                        value={optionIndex}
                                        checked={
                                          answers[questionIndex] ===
                                          optionIndex.toString()
                                        }
                                        disabled
                                        className="w-4 h-4 text-blue-600"
                                      />
                                      <span
                                        className={`flex-1 ${
                                          answers[questionIndex] ===
                                          optionIndex.toString()
                                            ? "font-semibold text-blue-600"
                                            : ""
                                        }`}
                                      >
                                        {option}
                                      </span>
                                    </>
                                  ) : (
                                    // 관리자 모드
                                    <>
                                      <span className="text-gray-500">
                                        {optionIndex + 1}.
                                      </span>
                                      {isAdminEditing ? (
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) =>
                                            updateOption(
                                              questionIndex,
                                              optionIndex,
                                              e.target.value
                                            )
                                          }
                                          className="border border-gray-300 rounded px-3 py-2 flex-1"
                                          placeholder="선택지를 입력하세요"
                                        />
                                      ) : (
                                        <span className="flex-1 px-3 py-2">
                                          {option}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              )
                            )}
                        </div>

                        {/* 관리자 모드 - 선택지 관리 버튼 */}
                        {isAdminEditing && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => addOption(questionIndex)}
                              className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                removeOption(
                                  questionIndex,
                                  surveyData.surveyQuestionMeta[questionIndex]
                                    .length - 1
                                )
                              }
                              disabled={
                                surveyData.surveyQuestionMeta[questionIndex]
                                  ?.length <= 1
                              }
                              className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-red-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // 주관식
                    <div className="flex items-center gap-4">
                      {isAdminEditing && (
                        <button
                          onClick={() => addQuestion(questionIndex)}
                          className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                        >
                          +
                        </button>
                      )}

                      {isUserMode ? (
                        // 사용자 모드 - 텍스트 입력
                        <textarea
                          value={answers[questionIndex] || ""}
                          onChange={(e) =>
                            updateAnswer(questionIndex, e.target.value)
                          }
                          placeholder="답변을 입력해주세요..."
                          className="flex-1 border border-gray-300 rounded px-3 py-2 min-h-[100px] resize-none"
                        />
                      ) : mode === "user" ? (
                        // 사용자 답변 보기 모드 - 읽기 전용
                        <div className="flex-1 border border-gray-300 rounded px-3 py-2 min-h-[100px] bg-gray-50">
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {answers[questionIndex] || "답변 없음"}
                          </div>
                        </div>
                      ) : (
                        // 관리자 모드 - 주관식 표시
                        <div className="flex-1 text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                          주관식 답변
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 하단 버튼들 - 고정 */}
      <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-4 bg-gray-50 border-t border-gray-200">
        {onCancel ? (
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          >
            {isAdminEditing ? "취소" : "목록으로"}
          </button>
        ) : null}
        {mode === "user" && !isExpired && (
          <button
            onClick={handleModify}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {"답변 수정"}
          </button>
        )}
        {mode === "admin" && !isEditing ? (
          <>
            {!isExpired && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                수정
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              삭제
            </button>
          </>
        ) : mode === "admin" && isEditing ? (
          <button
            onClick={handleAdminSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        ) : (mode === "submit" || mode === "edit") && !isExpired ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {mode === "edit" ? "답변 수정" : "설문 제출"}
          </button>
        ) : null}
        {isExpired && (isUserMode || mode === "user") && (
          <div className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
            마감된 설문입니다
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyViewer;
