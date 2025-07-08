import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { surveyWithMemberAnswerFetch } from "../services/survey/surveyFetch";
import {
  SurveyMembersResponse,
  SurveyQuestion as SurveyQuestionType,
} from "../types/survey";

interface AnswerCount {
  option: string;
  count: number;
  percentage: number;
}

interface QuestionStats {
  question: SurveyQuestionType;
  answerCounts: AnswerCount[];
  totalResponses: number;
  textAnswers?: string[];
}

const SurveyResponseViewer: React.FC = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  const [surveyData, setSurveyData] = useState<SurveyMembersResponse | null>(
    null
  );
  const [questionStats, setQuestionStats] = useState<QuestionStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!surveyId || !token) {
        return;
      }

      try {
        const data: SurveyMembersResponse = await surveyWithMemberAnswerFetch(
          surveyId,
          token
        );
        setSurveyData(data);

        // 각 문항별 통계 계산
        const stats: QuestionStats[] = data.survey.questions.map((question) => {
          const questionAnswers = data.members
            .map((member) =>
              member.answers.find((answer) => answer.questionId === question.id)
            )
            .filter((answer) => answer && answer.answer);

          if (question.type === "MULTIPLE_CHOICE") {
            // 객관식: 선택지별 카운트
            const answerCounts: { [key: string]: number } = {};

            // 모든 선택지를 0으로 초기화
            question.options?.forEach((option) => {
              answerCounts[option] = 0;
            });

            // 실제 답변 카운트
            questionAnswers.forEach((answer) => {
              if (answer && answerCounts.hasOwnProperty(answer.answer)) {
                answerCounts[answer.answer]++;
              }
            });

            const totalResponses = questionAnswers.length;
            const answerCountsArray: AnswerCount[] = Object.entries(
              answerCounts
            ).map(([option, count]) => ({
              option,
              count,
              percentage:
                totalResponses > 0 ? (count / totalResponses) * 100 : 0,
            }));

            return {
              question,
              answerCounts: answerCountsArray,
              totalResponses,
            };
          } else {
            // 주관식: 텍스트 답변 목록
            const textAnswers = questionAnswers
              .map((answer) => answer?.answer || "")
              .filter((answer) => answer.trim() !== "");

            return {
              question,
              answerCounts: [],
              totalResponses: textAnswers.length,
              textAnswers,
            };
          }
        });

        setQuestionStats(stats);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
        alert("설문 응답 데이터를 불러오는데 실패했습니다.");
        navigate("/survey");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [surveyId, token, navigate]);

  const handleBack = () => {
    navigate("/survey");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">응답 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">설문 응답을 찾을 수 없습니다.</div>
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
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← 목록으로
          </button>
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
            {surveyData.survey.className}
          </span>
          <h1 className="text-xl font-semibold text-gray-800 flex-1">
            {surveyData.survey.title}
          </h1>
          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
            응답 분석
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {surveyData.survey.description}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
          <div>
            마감일:{" "}
            {new Date(surveyData.survey.targetDate).toLocaleDateString()}
          </div>
          <div>
            총 응답: {surveyData.survey.answeredCount}/
            {surveyData.survey.memberCount}
          </div>
          <div>
            응답률:{" "}
            {surveyData.survey.memberCount > 0
              ? Math.round(
                  (surveyData.survey.answeredCount /
                    surveyData.survey.memberCount) *
                    100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      {/* 응답 통계 - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto px-8 min-h-0">
        <div className="space-y-6 pb-4">
          {questionStats.map((stat, index) => (
            <div
              key={stat.question.id}
              className="bg-white rounded-lg shadow-sm border"
            >
              {/* 문항 헤더 */}
              <div className="bg-gradient-to-r from-brand to-subBrand text-white p-4 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{index + 1}번 문항:</span>
                  <span className="flex-1">{stat.question.question}</span>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">
                    {stat.question.type === "MULTIPLE_CHOICE"
                      ? "객관식"
                      : "주관식"}
                  </span>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">
                    응답: {stat.totalResponses}명
                  </span>
                </div>
              </div>

              {/* 응답 통계 */}
              <div className="p-6">
                {stat.question.type === "MULTIPLE_CHOICE" ? (
                  <div className="space-y-4">
                    {stat.answerCounts.map((answerCount, optionIndex) => (
                      <div key={optionIndex} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">
                            {optionIndex + 1}. {answerCount.option}
                          </span>
                          <span className="text-sm text-gray-500">
                            {answerCount.count}명 (
                            {answerCount.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${answerCount.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 mb-4">
                      총 {stat.totalResponses}개의 응답
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {stat.textAnswers?.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="bg-gray-50 p-3 rounded border-l-4 border-blue-500"
                        >
                          <div className="text-sm text-gray-500 mb-1">
                            응답 {answerIndex + 1}
                          </div>
                          <div className="text-gray-700">{answer}</div>
                        </div>
                      ))}
                      {(!stat.textAnswers || stat.textAnswers.length === 0) && (
                        <div className="text-center text-gray-500 py-8">
                          아직 응답이 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 - 고정 */}
      <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleBack}
          className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default SurveyResponseViewer;
