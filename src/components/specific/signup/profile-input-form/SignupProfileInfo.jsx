import { useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import BirthInput from "./BirthInput";
import GenderInput from "./GenderInput";
import ImageInput from "./ImageInput";
import CustomInput from "../../../common/CustomInput";
import CustomButton from "../../../common/CustomButton";
import { HiArrowLeft } from "react-icons/hi";

const SignupProfileInfo = ({ member, updateMember, onNext, onPrev }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!member.birth) {
      newErrors.birth = "생년월일을 선택해주세요.";
    }

    if (!member.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext?.();
    } else {
      alert("입력값을 확인해주세요.");
    }
  };

  const handlePrev = () => {
    onPrev?.(); // 이전 화면으로 이동
  };

  return (
    <div className="w-full">
      <BirthInput
        birth={member.birth}
        setBirth={(val) => updateMember("birth", val)}
        error={errors.birth}
      />
      <GenderInput
        gender={member.gender}
        setGender={(val) => updateMember("gender", val)}
        error={errors.gender}
      />
      <ImageInput
        image={member.image}
        setImage={(val) => updateMember("image", val)}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />
      <CustomInput
        label="주소"
        placeholder="서울특별시 금천구"
        value={member.addr}
        onChange={(val) => updateMember("addr", val)}
      />
      <div className="w-full flex gap-4 mt-10">
        <CustomButton
          label="이전"
          onClick={handlePrev}
          className="w-1/5 py-3 rounded-lg"
          variant="outline"
          size="md"
        />
        <CustomButton
          label="다음"
          onClick={handleNext}
          className="py-3 rounded-lg"
          variant="brand"
          size="md"
        />
      </div>
    </div>
  );
};

export default SignupProfileInfo;
