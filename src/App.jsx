import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Calendar from "./pages/Calendar";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice";
import Survey from "./pages/Survey";
import Organization from "./pages/Organization";
import SingleNotice from "./pages/SingleNotice";
import WritePage from "./pages/WritePage";
import OrganizationClass from "./pages/OrganizationClass";
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
          <Route path="organization" element={<Organization />} />
          <Route path="organization/:classId" element={<OrganizationClass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
