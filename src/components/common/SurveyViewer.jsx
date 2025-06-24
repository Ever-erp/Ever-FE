import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  singleSurveyFetch,
  surveyUpdateFetch,
  surveyDeleteFetch,
  surveySubmitFetch,
  surveySubmitUpdateFetch,
} from "../../services/survey/surveyFetch";
import { getStatusBadgeColor } from "../../util/surveyUtil";
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

  const [surveyData, setSurveyData] = useState({
    surveyId: "",
    surveyTitle: "",
    surveyDesc: "",
    dueDate: "",
    status: "",
    surveySize: "",
    createdAt: "",
    surveyQuestion: [],
    surveyQuestionMeta: [],
  });

  useEffect(() => {
    singleSurveyFetch(surveyId).then((res) => {
      setSurveyData(res);
      if (mode === "submit" || mode === "edit") {
        let initialAnswers = new Array(res.surveyQuestion?.length || 0).fill(
          ""
        );

        if (existingAnswers) {
          initialAnswers = existingAnswers.map((answer, index) => {
            // 객관식 질문인지 확인
            if (
              res.surveyQuestionMeta &&
              res.surveyQuestionMeta[index] &&
              !res.surveyQuestionMeta[index].includes("주관식")
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
    return surveyData.surveyQuestionMeta[questionIndex].includes("주관식");
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
    newQuestionMeta.splice(afterIndex + 1, 0, ["옵션1", "옵션2"]);

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
      newQuestionMeta[questionIndex] = ["주관식"];
    } else {
      newQuestionMeta[questionIndex] = ["옵션1", "옵션2"];
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
      await surveyUpdateFetch(surveyData.surveyId, surveyData);
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
          !surveyData.surveyQuestionMeta[index].includes("주관식")
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
        await surveySubmitUpdateFetch(surveyData.surveyId, submitData);
        alert("설문 답변이 성공적으로 수정되었습니다.");
      } else {
        // 신규 제출 모드
        await surveySubmitFetch(surveyData.surveyId, submitData);
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
        await surveyDeleteFetch(surveyData.surveyId);
        alert("설문이 성공적으로 삭제되었습니다.");
        if (onCancel) onCancel();
      } catch (error) {
        console.error("설문 삭제 중 오류:", error);
        alert("설문 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 취소
  const handleCancel = () => {
    if (mode === "admin" && isEditing) {
      setIsEditing(false);
      // 원래 데이터로 복원
      singleSurveyFetch(surveyId).then((res) => {
        setSurveyData(res);
      });
    } else {
      if (onCancel) onCancel();
    }
  };

  // 관리자 편집 모드 체크
  const isAdminEditing = mode === "admin" && isEditing;
  const isUserMode = mode === "submit" || mode === "edit";

  return (
    <div
      className="flex flex-col w-full bg-gray-50 overflow-hidden"
      style={{ height: "80vh" }}
    >
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 p-8 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
            웹/앱
          </span>
          <span className="text-gray-600">{surveyData.surveyTitle}</span>
          <span
            className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(
              surveyData.status
            )}`}
          >
            {surveyData.status}
          </span>
        </div>

        <div className="text-gray-600 mb-2">{surveyData.dueDate}</div>
        <div className="text-gray-600">
          {isUserMode
            ? `${surveyData.surveySize}개 문항`
            : `0/${surveyData.surveySize}`}
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
        {mode === "admin" && !isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              수정
            </button>
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
        ) : mode === "submit" || mode === "edit" ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {mode === "edit" ? "답변 수정" : "설문 제출"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SurveyViewer;
