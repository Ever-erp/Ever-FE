import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyViewer from "../components/specific/survey/SurveyViewer";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useSelector } from "react-redux";
// 설문 상세 페이지 (관리자/유저 전용)
const SingleSurvey = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthFetch();
  const user = useSelector((state) => state.user.user);

  const handleSave = () => {};

  const handleCancel = () => {
    navigate("/survey");
  };

  if (user.position === "관리자") {
    return (
      <SurveyViewer
        surveyId={params.surveyId}
        mode="admin"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  } else {
    return (
      <SurveyViewer
        surveyId={params.surveyId}
        mode="user"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }
};

export default SingleSurvey;
