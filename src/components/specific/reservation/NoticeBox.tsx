// components/NoticeBox.jsx
import React from "react";

const NoticeBox = () => {
  return (
    <div className="mt-[2vh] text-lg text-gray-600 leading-relaxed">
      <p>- 예약은 기본적으로 1시간 단위로 가능합니다.</p>
      <p>
        - 각 회의실에는 프로젝트 진행 절차 및 이용 안내문이 부착되어 있으니,
        이용 전에 꼭 확인해 주세요.
      </p>
      <p>
        - 모두가 함께 사용하는 공간이므로 서로 배려하여 쾌적한 환경을 유지해
        주세요.
      </p>
    </div>
  );
};

export default NoticeBox;
