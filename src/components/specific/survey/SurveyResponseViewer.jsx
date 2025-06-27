import React, { useState, useEffect } from "react";
import { surveyWithMemberAnswerFetch } from "../../../services/survey/surveyFetch";
import { getStatusBadgeColor, parsedDate } from "../../../util/surveyUtil";
import Loading from "../../common/Loading";

const SurveyResponseViewer = ({ surveyId, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (surveyId) {
      fetchResponseData();
    }
  }, [surveyId]);

  const fetchResponseData = async () => {
    try {
      setLoading(true);
      const data = await surveyWithMemberAnswerFetch(surveyId, token);
      setResponseData(data);
    } catch (error) {
      console.error("응답 현황 조회 오류:", error);
      alert("응답 현황을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주관식 질문인지 확인
  const isSubjectiveQuestion = (questionIndex) => {
    if (!responseData?.survey?.surveyQuestionMeta?.[questionIndex]) {
      return true; // 메타데이터가 없으면 주관식으로 처리
    }
    const meta = responseData.survey.surveyQuestionMeta[questionIndex];
    return !Array.isArray(meta) || meta.length === 0;
  };

  const getMultipleChoiceAnswer = (answer, questionIndex) => {
    if (isSubjectiveQuestion(questionIndex)) {
      return answer;
    }

    const options = responseData.survey.surveyQuestionMeta[questionIndex];

    const answerIndex = parseInt(answer) - 1;
    if (
      !isNaN(answerIndex) &&
      answerIndex >= 0 &&
      answerIndex < options.length
    ) {
      return `${answerIndex + 1}. ${options[answerIndex]}`;
    }

    return answer || "답변 없음";
  };

  if (loading) {
    return <Loading text="응답 현황을 불러오는 중" />;
  }

  if (!responseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">응답 현황 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const { survey, members, notAnsweredMembers } = responseData;

  return (
    <div className="flex flex-col w-full bg-gray-50" style={{ height: "80vh" }}>
      {/* 헤더 */}
      <div className="flex-shrink-0 p-8 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
            {survey.className}
          </span>
          <span className="text-gray-600 font-medium">
            {survey.surveyTitle}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(
              survey.status
            )}`}
          >
            {survey.status}
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-gray-600 text-sm">
            <span className="font-medium">설명:</span>{" "}
            {survey.surveyDesc || "설명 없음"}
          </div>
          <div className="text-gray-600 text-sm">
            <span className="font-medium">마감일:</span> {survey.dueDate}
          </div>
          <div className="text-gray-600 text-sm">
            <span className="font-medium">생성일:</span>{" "}
            {parsedDate(survey.createdAt)}
          </div>
        </div>

        <div className="text-gray-600 text-sm">
          응답 현황: {survey.answeredCount}/{survey.classTotalMemberCount}(
          {survey.classTotalMemberCount > 0
            ? Math.round(
                (survey.answeredCount / survey.classTotalMemberCount) * 100
              )
            : 0}
          %)
        </div>
      </div>

      {/* 응답 현황 테이블 */}
      <div className="flex-1 w-full overflow-y-auto min-h-0">
        <div className="px-8">
          <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-brand to-subBrand text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">응답 현황</h3>
            </div>

            <div className="overflow-x-auto">
              {/* 테이블 헤더 */}
              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      학생명
                    </th>
                    {survey.surveyQuestion.map((question, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700 min-w-[200px]"
                      >
                        {index + 1}번. {question}
                        <span className="block text-xs text-gray-500 mt-1">
                          {isSubjectiveQuestion(index) ? (
                            "(주관식)"
                          ) : (
                            <>
                              (객관식)
                              <div className="text-xs text-gray-400 mt-1">
                                {responseData.survey.surveyQuestionMeta[
                                  index
                                ]?.map((option, optIndex) => (
                                  <div key={optIndex}>
                                    {optIndex + 1}. {option}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 응답한 학생들 */}
                  {members.map((member, memberIndex) => (
                    <tr key={member.memberId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {member.memberName}
                        <span className="block text-xs text-green-600">
                          응답 완료
                        </span>
                      </td>
                      {member.answer.map((answer, answerIndex) => (
                        <td
                          key={answerIndex}
                          className="border border-gray-300 px-4 py-2"
                        >
                          <div className="max-w-xs">
                            {isSubjectiveQuestion(answerIndex) ? (
                              // 주관식 답변
                              <div className="text-sm text-gray-700 break-words">
                                {answer || "답변 없음"}
                              </div>
                            ) : (
                              // 객관식 답변
                              <div className="text-sm text-gray-700">
                                {getMultipleChoiceAnswer(answer, answerIndex)}
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* 미응답 학생들 */}
                  {notAnsweredMembers.map((member) => (
                    <tr
                      key={`not-answered-${member.memberId}`}
                      className="hover:bg-gray-50 bg-red-50"
                    >
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {member.memberName}
                        <span className="block text-xs text-red-600">
                          미응답
                        </span>
                      </td>
                      {survey.surveyQuestion.map((_, questionIndex) => (
                        <td
                          key={questionIndex}
                          className="border border-gray-300 px-4 py-2 text-center text-gray-400"
                        >
                          -
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                전체 대상자
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {survey.classTotalMemberCount}명
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                응답 완료
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {survey.answeredCount}명
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">미응답</h4>
              <p className="text-2xl font-bold text-red-600">
                {notAnsweredMembers.length}명
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default SurveyResponseViewer;
