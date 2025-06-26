import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyViewer from "../components/common/SurveyViewer";
import { findSurveyBySurveyIdAndMemberIdFetch } from "../services/survey/surveyFetch";

const SurveyEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [existingAnswers, setExistingAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("submit"); // "submit" 또는 "edit"
  const [hasExistingAnswer, setHasExistingAnswer] = useState(false);

  // 기존 답변 불러오기
  const fetchExistingAnswers = async () => {
    try {
      const response = await findSurveyBySurveyIdAndMemberIdFetch(
        params.surveyId,
        1 // TODO: 실제 로그인한 사용자 ID로 변경
      );

      if (200 <= response.status && response.status < 300) {
        // 이미 답변한 경우 - 수정 모드
        setMode("edit");
        setHasExistingAnswer(true);
        setExistingAnswers(response.data.answer);
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

  const handleSuccess = () => {
    if (mode === "edit") {
      navigate(`/survey/${params.surveyId}/submit`);
    } else {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">설문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {hasExistingAnswer ? "설문 답변 수정" : "설문 답변"}
          </h1>
          <p className="text-gray-600">
            {hasExistingAnswer
              ? "기존에 작성하신 답변을 수정할 수 있습니다. 수정 후 저장 버튼을 눌러주세요."
              : "모든 문항에 답변해주세요. 답변 후 제출 버튼을 눌러주세요."}
          </p>
        </div>

        <SurveyViewer
          surveyId={params.surveyId}
          mode={mode}
          existingAnswers={existingAnswers}
          onSave={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default SurveyEdit;
