import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Calendar from "./pages/Calendar";
import Reservation from "./pages/Reservation";
import Notice from "./pages/Notice";
import Survey from "./pages/Survey";
import SingleNotice from "./pages/SingleNotice";
import WritePage from "./pages/WritePage";
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
