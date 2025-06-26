import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyViewer from "../components/common/SurveyViewer";
import { useAuthFetch } from "../hooks/useAuthFetch";
// 설문 상세 페이지 (관리자 전용)
const SingleSurvey = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthFetch();

  const handleSave = () => {
  };

  const handleCancel = () => {
    navigate("/survey");
  };

  return (
    <SurveyViewer
      surveyId={params.surveyId}
      mode="admin"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default SingleSurvey;
