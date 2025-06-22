import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Calendar from "./pages/Calendar";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice";
import Survey from "./pages/Survey";
import Organization from "./pages/Organization";
import AuthPageLayout from "./layouts/AuthPageLayout";
import SignUpForm from "./components/specific/signup/SignupForm";
import LoginForm from "./components/specific/login/LoginForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 레이아웃 */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Calendar />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="notice" element={<Notice />} />
          <Route path="survey" element={<Survey />} />
          <Route path="organization" element={<Organization />} />
        </Route>
        {/* 회원가입 */}
        <Route
          path="/signup"
          element={
            <AuthPageLayout>
              <SignUpForm />
            </AuthPageLayout>
          }
        />
        {/* 로그인 */}
        <Route
          path="/login"
          element={
            <AuthPageLayout>
              <LoginForm />
            </AuthPageLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
