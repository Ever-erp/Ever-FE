export interface ReservationInfo {
  roomNum: string;
  reservationTime: number | null;
  headCount: string;
  reservationDesc: string;
}

export interface MyReservation {
  roomNum: number;
  startTime: number;
}
