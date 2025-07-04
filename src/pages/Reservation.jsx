import React, { useEffect, useState } from "react";
import ClassMap from "@/assets/svgs/class-map.svg?react";
import "@/assets/styles/svg.css";
import TimeSelector from "../components/specific/reservation/TimeSelector";
import NoticeBox from "../components/specific/reservation/NoticeBox";
import MeetingRoomReservationBtn from "../components/specific/reservation/MeetingRoomReservationBtn";
import MeetingRoomReservationModal from "../components/specific/reservation/MeetingRoomReservationModal";
import NoticeColor from "../components/specific/reservation/NoticeColor";
import SelectedRoom from "../components/specific/reservation/SelectedRoom";
import { useAuthFetch } from "../hooks/authFetch";
import { fetchReservedTimes } from "../services/reservation/fetchReservedTime";
import { fetchReservation } from "../services/reservation/fetchReservation";

const Reservation = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRoomSelected, setIsRoomSelected] = useState(false);

  const [reservedTimes, setReservedTimes] = useState([]); // 이미 예약된 시간 목록

  const [myReservations, setMyReservations] = useState([]);
  const [fullyBookedRooms, setFullyBookedRooms] = useState([]);

  const { isAuthenticated } = useAuthFetch();

  // 예약 상태 (회의실 번호, 예약 시간, 인원수, 예약 상세)
  const [reservation, setReservation] = useState({
    roomNum: "",
    reservationTime: "",
    headCount: "",
    reservationDesc: "",
  });

  const updateReservation = (field, value) => {
    setReservation((prev) => ({ ...prev, [field]: value }));
  };

  // 회의실 클릭 시
  const handleClick = async (e) => {
    const roomGroup = e.target.closest("g.clickable");
    if (roomGroup) {
      const selectedRoomNum = roomGroup.id;
      setIsRoomSelected(selectedRoomNum);
      updateReservation("roomNum", selectedRoomNum);
      updateReservation("reservationTime", null); // 회의 예약 시간 초기화

      try {
        const times = await fetchReservedTimes(selectedRoomNum);
        setReservedTimes(times); // 시간 지정

        const res = await fetchReservation(); // 회의실 정보 다시 불러오기

        setMyReservations(res.data.myReservations || []); // 내 예약 데이터 저장
        setFullyBookedRooms(res.data.fullyBookedRooms || []); // 꽉 찬 방 목록 저장
      } catch (error) {
        console.error(error);
        alert("회의실 예약 중 오류가 발생했습니다.", error);
      }
    }
  };

  // 처음 마운트될 때
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const res = await fetchReservation();

        setMyReservations(res.data.myReservations || []); // 내 예약 데이터 저장
        setFullyBookedRooms(res.data.fullyBookedRooms || []); // 꽉 찬 방 목록 저장
      } catch (error) {
        console.error(error);
        alert("회의실 전체 조회 중 오류가 발생했습니다.", error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // 회의실 클릭 시 색 변경
  useEffect(() => {
    const groups = document.querySelectorAll("g.clickable");

    // 먼저 전체 초기화
    groups.forEach((g) => {
      g.classList.remove("selected", "reserved", "full");
    });

    // 1. full 처리 먼저
    fullyBookedRooms.forEach((roomNum) => {
      console.log(roomNum);
      const target = document.getElementById(String(roomNum));
      if (target) {
        target.classList.add("full");
      }
    });

    // 2. 나머지 방들 처리
    groups.forEach((g) => {
      const isFull = g.classList.contains("full");
      if (isFull) return; // full이면 reserved/selected 무시

      const isReserved = myReservations.some((r) => String(r.roomNum) === g.id);
      if (isReserved) {
        g.classList.add("reserved");
        return;
      }

      if (g.id === isRoomSelected) {
        g.classList.add("selected");
        return;
      }
    });
  }, [isRoomSelected, myReservations, fullyBookedRooms]);

  // 예약 완료 후 실행될 콜백 함수
  const handleReservationComplete = async () => {
    try {
      // 전체 예약 정보 다시 불러오기
      const res = await fetchReservation();
      setMyReservations(res.data.myReservations || []); // 내 예약 데이터 저장
      setFullyBookedRooms(res.data.fullyBookedRooms || []); // 꽉 찬 방 목록 저장

      const times = await fetchReservedTimes(reservation.roomNum);
      setReservedTimes(times);

      // 선택했던 시간 초기화 (selected 해제)
      updateReservation("reservationTime", null);

      // 모달 닫기
      setShowModal(false);
    } catch (error) {
      console.error("예약 완료 후 데이터 갱신 실패:", error);
      alert("예약 후 정보 갱신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex w-[70vw] gap-[5vw] items-center">
      {/* 왼쪽: 오토에버 교육장 구조도 */}
      <div className="flex flex-col w-[40vw] min-w-[500px] gap-[2vh]">
        <div className="flex flex-col gap-2">
          <SelectedRoom roomNum={reservation.roomNum} />
          <ClassMap className="w-full h-auto" onClick={handleClick} />
          <NoticeColor />
        </div>
        <NoticeBox />
      </div>

      {/* 오른쪽: 시간선택 */}
      {/* 회의실 선택한 경우에만 시간 보여주기 */}
      {isRoomSelected ? (
        <div className="flex-1">
          <TimeSelector
            reservation={reservation}
            updateReservation={updateReservation}
            reservedTimes={reservedTimes} // 배열: [9, 10]
            myReservations={myReservations}
          />
          {/* 시간까지 선택된 경우에만 예약 버튼 보여주기 */}
          {reservation.reservationTime && (
            <MeetingRoomReservationBtn
              setShowModal={setShowModal}
              myReservations={myReservations}
              reservation={reservation}
              onComplete={handleReservationComplete}
            />
          )}
        </div>
      ) : null}

      {/* 휴가 입력 모달창 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <MeetingRoomReservationModal
            reservation={reservation}
            updateReservation={updateReservation}
            reservedTimes={reservedTimes}
            onClose={() => setShowModal(false)}
            onComplete={handleReservationComplete}
          />
        </div>
      )}
    </div>
  );
};

export default Reservation;
