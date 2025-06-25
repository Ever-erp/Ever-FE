import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null }, // 초기엔 로그인 안함
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // 유저 저장
    },
    clearUser: (state) => {
      state.user = null; // 로그아웃 시 제거
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
