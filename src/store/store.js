// Redux Toolkit에서 store 생성 함수 가져오기
import { configureStore } from "@reduxjs/toolkit";

// redux-persist 관련 함수 및 localStorage 저장소 설정
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage 사용

// 사용자 상태를 관리하는 슬라이스 import
import userReducer from "./userSlice";

// 여러 리듀서를 하나로 합치기 위한 함수
import { combineReducers } from "redux";

// persist 설정: 저장 키와 사용할 storage 지정
const persistConfig = {
  key: "root", // localStorage에 저장될 key 이름
  storage, // localStorage 사용
};

// 여러 리듀서를 하나로 합친 루트 리듀서 생성
const rootReducer = combineReducers({
  user: userReducer,
});

// persist 설정을 적용한 리듀서 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Store 생성
export const store = configureStore({
  reducer: persistedReducer, // persist 적용된 리듀서 사용
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist가 사용하는 비직렬화 액션 예외 처리
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// persist를 위한 persistor 생성 (store와 함께 사용)
export const persistor = persistStore(store);
