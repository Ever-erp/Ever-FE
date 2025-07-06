import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice.tsx";
import Survey from "./pages/Survey";
import SingleNotice from "./pages/SingleNotice.tsx";
import WritePage from "./pages/WritePage.tsx";
import Organization from "./pages/Organization";
import OrganizationClass from "./pages/OrganizationClass";

import AuthPageLayout from "./layouts/AuthPageLayout";
import SignUpForm from "./components/specific/signup/SignupForm";
import LoginForm from "./components/specific/login/LoginForm";
import PrivateRoute from "./components/specific/routes/PrivateRoute";
import { useSelector } from "react-redux";
import PublicRoute from "./components/specific/routes/PublicRoute";
import Calendar from "./pages/Calendar";

import SingleSurvey from "./pages/SingleSurvey";
import SurveyWrite from "./pages/SurveyWrite";
import SurveySubmit from "./pages/SurveySubmit";

interface RootState {
  user: {
    user: {
      name: string;
      position: string;
      role: string;
    };
  };
}

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Router>
      <Routes>
        {/* 로그인/회원가입: 로그인 상태라도 접근 가능 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPageLayout>
                <LoginForm />
              </AuthPageLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <AuthPageLayout>
                <SignUpForm />
              </AuthPageLayout>
            </PublicRoute>
          }
        />

        {/* 보호된 경로: 로그인 안 하면 접근 불가 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DefaultLayout />
            </PrivateRoute>
          }
        >
          <Route path="calendar" element={<Calendar />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="notice" element={<Notice />} />
          <Route path="notice/write" element={<WritePage />} />
          <Route path="notice/:noticeId" element={<SingleNotice />} />
          <Route path="survey" element={<Survey />} />
          <Route path="survey/:surveyId" element={<SingleSurvey />} />
          <Route path="survey/:surveyId/submit" element={<SurveySubmit />} />
          <Route path="survey/write" element={<SurveyWrite />} />
          <Route path="organization" element={<Organization />} />
          <Route
            path="organization/class/:classId"
            element={<OrganizationClass />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
