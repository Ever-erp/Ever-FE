import ClassMap from "@/assets/svgs/class-map.svg?react";
import "@/assets/styles/svg.css";

const handleClick = (e) => {
  const roomGroup = e.target.closest("g.clickable");
  if (roomGroup) {
    console.log("선택한 방 id:", roomGroup.id);
  }
};

const Reservation = () => {
  return (
    <div className="flex flex-row">
      <ClassMap className="w-[800px] h-[320px]" onClick={handleClick} />
      <div>글자</div>
    </div>
  );
};

export default Reservation;
