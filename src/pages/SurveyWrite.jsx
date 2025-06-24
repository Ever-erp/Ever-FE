import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SurveyWrite = () => {
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState({
    title: "",
    description: "",
    endDate: "",
    questions: [
      {
        id: 1,
        type: "객관식", // 객관식 또는 주관식
        question: "",
        options: [""],
      },
    ],
  });
  // 문항 추가 (특정 문항 아래에)
  const addQuestion = (afterIndex) => {
    const newQuestion = {
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
  const removeQuestion = (questionId) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.filter((q) => q.id !== questionId),
    });
  };
  // 문항 내용 수정
  const updateQuestion = (questionId, field, value) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    });
  };
  // 문항 타입 변경
  const changeQuestionType = (questionId, type) => {
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
  const addOption = (questionId) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      ),
    });
  };
  // 선택지 삭제
  const removeOption = (questionId, optionIndex) => {
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
  const updateOption = (questionId, optionIndex, value) => {
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
  const handleSave = () => {
    console.log("설문 저장:", surveyData);
    // API 호출 로직
    navigate("/survey");
  };
  // 취소
  const handleCancel = () => {
    navigate("/survey");
  };

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
          <span className="text-gray-600">[웹/앱] 12주차 설문</span>
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
            작성중
          </span>
        </div>

        <div className="text-gray-600 mb-2">2025-06-12</div>
        <div className="text-gray-600">0/25</div>
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
          className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
        >
          작성 취소
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          설문 저장
        </button>
      </div>
    </div>
  );
};

export default SurveyWrite;
