import React from "react";

interface SelectedRoomProps {
  roomNum?: string | null;
}

const SelectedRoom = ({ roomNum }: SelectedRoomProps) => {
  return (
    <>
      {roomNum && (
        <div className="flex justify-end items-center gap-2 p-1">
          선택된 회의실:{" "}
          <span className="text-xl text-brand font-semibold">{roomNum}</span>
        </div>
      )}
    </>
  );
};

export default SelectedRoom;
