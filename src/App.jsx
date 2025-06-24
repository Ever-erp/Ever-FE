import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Calendar from "./pages/Calendar";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice";
import Survey from "./pages/Survey";
import Organization from "./pages/Organization";
import AuthPageLayout from "./layouts/AuthPageLayout";
import SignUpForm from "./components/specific/signup/SignupForm";
import LoginForm from "./components/specific/login/LoginForm";
import PrivateRoute from "./components/specific/routes/PrivateRoute";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <Router>
      <Routes>
        {/* 로그인/회원가입: 로그인 상태라도 접근 가능 */}
        <Route
          path="/login"
          element={
            <AuthPageLayout>
              <LoginForm />
            </AuthPageLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthPageLayout>
              <SignUpForm />
            </AuthPageLayout>
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
          <Route path="survey" element={<Survey />} />
          <Route path="organization" element={<Organization />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
