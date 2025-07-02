import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  surveyRedirect: null, // 설문 페이지로 이동할 때 필요한 정보
  adminSurveyClick: "survey", // 관리자 설문 현황 / 응답 현황 클릭 여부 (기본값: "survey")
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setSurveyRedirect: (state, action) => {
      // 상태가 올바른 객체인지 확인
      if (typeof state !== "object" || state === null) {
        return {
          ...initialState,
          surveyRedirect: action.payload,
        };
      }
      state.surveyRedirect = action.payload;
    },
    setAdminSurveyClick: (state, action) => {
      // 상태가 올바른 객체인지 확인
      if (typeof state !== "object" || state === null) {
        return {
          ...initialState,
          adminSurveyClick: action.payload,
        };
      }
      state.adminSurveyClick = action.payload;
    },
    // 상태 초기화 액션 추가
    resetSurveyState: () => {
      return initialState;
    },
  },
});

// 셀렉터 함수 - 안전한 접근을 위한 기본값 설정
export const getAdminSurveyClick = (state) => {
  // state.survey가 올바른 객체인지 확인
  if (typeof state.survey !== "object" || state.survey === null) {
    return "survey"; // 기본값 반환
  }
  return state.survey.adminSurveyClick || "survey";
};

export const { setSurveyRedirect, setAdminSurveyClick, resetSurveyState } =
  surveySlice.actions;
export default surveySlice.reducer;
