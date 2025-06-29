import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyViewer from "../components/specific/survey/SurveyViewer";
import {
  findSurveyBySurveyIdAndMemberIdFetch,
  singleSurveyFetch,
} from "../services/survey/surveyFetch";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { isDateExpired } from "../util/surveyUtil";

const SurveySubmit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [existingAnswers, setExistingAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("submit"); // "submit" 또는 "edit"
  const [hasExistingAnswer, setHasExistingAnswer] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  const { isAuthenticated } = useAuthFetch();
  const token = localStorage.getItem("accessToken");

  const fetchExistingAnswers = async () => {
    try {
      const surveyResponse = await singleSurveyFetch(params.surveyId, token);
      setSurveyData(surveyResponse);

      const expired = isDateExpired(surveyResponse.dueDate);
      setIsExpired(expired);

      if (expired) {
        setLoading(false);
        return;
      }

      const response = await findSurveyBySurveyIdAndMemberIdFetch(
        params.surveyId,
        token
      );

      if (response.member.answer) {
        setMode("edit");
        setHasExistingAnswer(true);
        setExistingAnswers(response.member.answer);
      } else {
        setMode("submit");
        setHasExistingAnswer(false);
        setExistingAnswers(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("기존 답변 불러오기 실패:", error);
      setMode("submit");
      setHasExistingAnswer(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingAnswers();
  }, [params.surveyId]);

  const handleSubmitSuccess = () => {
    navigate("/survey");
  };

  const handleCancel = () => {
    navigate("/survey");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">설문 정보를 불러오는 중</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isExpired
              ? "마감된 설문"
              : hasExistingAnswer
              ? "설문 답변 수정"
              : "설문 답변"}
          </h1>
          <p className="text-gray-600">
            {isExpired
              ? "이 설문은 마감되어 더 이상 답변하거나 수정할 수 없습니다."
              : hasExistingAnswer
              ? "기존에 작성하신 답변을 수정할 수 있습니다. 수정 후 저장 버튼을 눌러주세요."
              : "모든 문항에 답변해주세요. 답변 후 제출 버튼을 눌러주세요."}
          </p>
        </div>

        {isExpired ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-lg shadow-lg border p-12 text-center max-w-md w-full mx-4">
              <div className="text-gray-500 text-xl mb-6">
                📅 이 설문은 마감되었습니다
              </div>
              <div className="text-gray-600 mb-8">
                마감일: {surveyData?.dueDate}
              </div>
              <button
                onClick={() => navigate("/survey")}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                설문 목록으로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          <SurveyViewer
            surveyId={params.surveyId}
            mode={mode}
            existingAnswers={existingAnswers}
            onSave={handleSubmitSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default SurveySubmit;
