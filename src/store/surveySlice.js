import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  surveyRedirect: null, // 설문 페이지로 이동할 때 필요한 정보
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setSurveyRedirect: (state, action) => {
      state.surveyRedirect = action.payload;
    },
  },
});

export const { setSurveyRedirect } = surveySlice.actions;
export default surveySlice.reducer;
