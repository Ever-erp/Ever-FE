import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Calendar from "./pages/Calendar";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice";
import Survey from "./pages/Survey";
import SingleNotice from "./pages/SingleNotice";
import WritePage from "./pages/WritePage";
import Organization from "./pages/Organization";
import OrganizationClass from "./pages/OrganizationClass";
import SingleSurvey from "./pages/SingleSurvey";
import SurveyWrite from "./pages/SurveyWrite";
import SurveySubmit from "./pages/SurveySubmit";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Calendar />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="notice" element={<Notice />} />
          <Route path="notice/write" element={<WritePage />} />
          <Route path="notice/:noticeId" element={<SingleNotice />} />
          <Route path="survey" element={<Survey />} />
          <Route path="survey/:surveyId" element={<SingleSurvey />} />
          <Route path="survey/:surveyId/submit" element={<SurveySubmit />} />
          <Route path="survey/write" element={<SurveyWrite />} />
          <Route path="organization" element={<Organization />} />
          <Route path="organization/:classId" element={<OrganizationClass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
