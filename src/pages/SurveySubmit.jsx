import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyViewer from "../components/common/SurveyViewer";
import { findSurveyBySurveyIdAndMemberIdFetch } from "../services/survey/surveyFetch";
import { useAuthFetch } from "../hooks/useAuthFetch";
const SurveySubmit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [existingAnswers, setExistingAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("submit"); // "submit" 또는 "edit"
  const [hasExistingAnswer, setHasExistingAnswer] = useState(false);

  const { isAuthenticated } = useAuthFetch();

  const token = localStorage.getItem("accessToken");

  // 기존 답변 불러오기
  const fetchExistingAnswers = async () => {
    try {
      const response = await findSurveyBySurveyIdAndMemberIdFetch(
        params.surveyId,
        token
      );

      if (response.survey.surveyAnswer.length > 0) {
        // 이미 답변한 경우 - 수정 모드
        setMode("edit");
        setHasExistingAnswer(true);
        setExistingAnswers(response.survey.surveyAnswer);
      } else {
        // 아직 답변하지 않은 경우 - 제출 모드
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
    navigate("/");
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
    <div className="h-full w-full relative">
      <div className="h-full w-full bg-gray-50">
        <SurveyViewer
          surveyId={params.surveyId}
          mode={mode}
          existingAnswers={existingAnswers}
          onSave={handleSubmitSuccess}
        />
      </div>
    </div>
  );
};

export default SurveySubmit;
