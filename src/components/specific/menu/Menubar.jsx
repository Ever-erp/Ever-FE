import React from "react";
import MenuItem from "./MenuItem";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { BiSolidGridAlt } from "react-icons/bi";
import { PiClipboardTextBold } from "react-icons/pi";
import { FaListCheck } from "react-icons/fa6";
import { GiOrganigram } from "react-icons/gi";

const Menubar = () => {
  return (
    <nav className="flex flex-col">
      <MenuItem
        to="/calendar"
        label="일정 관리"
        icon={<FaRegCalendarCheck className="w-7 h-7" />}
      />
      <MenuItem
        to="/reservation"
        label="예약 관리"
        icon={<BiSolidGridAlt className="w-7 h-7" />}
      />
      <MenuItem
        to="/notice"
        label="공지 사항"
        icon={<PiClipboardTextBold className="w-7 h-7" />}
      />
      <MenuItem
        to="/survey"
        label="설문 조사"
        icon={<FaListCheck className="w-6 h-6" />}
      />
      <MenuItem
        to="/organization"
        label="조직도"
        icon={<GiOrganigram className="w-8 h-8" />}
      />
    </nav>
  );
};

export default Menubar;
