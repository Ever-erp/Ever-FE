import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPageLayout from "./layouts/AuthPageLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice";
import Survey from "./pages/Survey";
import SingleNotice from "./pages/SingleNotice";
import WritePage from "./pages/WritePage";
import Organization from "./pages/Organization";
import OrganizationClass from "./pages/OrganizationClass";

import PrivateRoute from "./components/specific/routes/PrivateRoute";
import PublicRoute from "./components/specific/routes/PublicRoute";
import Calendar from "./pages/Calendar";

import SingleSurvey from "./pages/SingleSurvey";
import SurveyWrite from "./pages/SurveyWrite";
import SurveySubmit from "./pages/SurveySubmit";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인/회원가입: 로그인 상태라도 접근 가능 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPageLayout>
                <Login />
              </AuthPageLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <AuthPageLayout>
                <SignUp />
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
}

export default App;
