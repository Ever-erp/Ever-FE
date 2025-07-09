import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SurveyViewer from "../components/specific/survey/SurveyViewer";
import SurveyResponseViewer from "../components/specific/survey/SurveyResponseViewer";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useSelector } from "react-redux";

interface RootState {
  user: {
    user: {
      name: string;
      position: string;
    };
  };
  survey: any;
}

// 설문 상세 페이지 (관리자/유저 전용)
const SingleSurvey = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isAuthenticated } = useAuthFetch();
  const user = useSelector((state: RootState) => state.user.user);

  const mode = searchParams.get("mode"); // "response" 또는 null

  const handleSave = () => {};

  const handleCancel = () => {
    navigate("/survey");
  };

  // 응답 현황 모드 (관리자만)
  if (user.position === "ROLE_관리자" && mode === "response") {
    return (
      <SurveyResponseViewer
        surveyId={params.surveyId}
        onCancel={handleCancel}
      />
    );
  }

  // 설문 현황 모드
  if (user.position === "ROLE_관리자") {
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
