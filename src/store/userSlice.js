import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // 로그인한 유저 정보, 없으면 null
  isLoggedIn: false, // 로그인 상태 플래그 추가
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true; // 사용자 정보가 들어오면 로그인 상태로 변경
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false; // 로그아웃 시 상태 초기화
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
