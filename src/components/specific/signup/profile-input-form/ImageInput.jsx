import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import CustomInputContainer from "../../../common/CustomInputContainer";
import { RxCross2 } from "react-icons/rx";

const ImageInput = ({ image, setImage, previewUrl, setPreviewUrl }) => {
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = ""; // 같은 파일 다시 선택해도 onChange 발생하도록 초기화

    if (file && file.size <= 1024 * 1024) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      // 브라우저가 메모리에 임시 URL을 만들어 이미지 미리보기를 가능하게 함
      setIsValid(true);
      setIsFocused(false);
    } else {
      alert("1MB 이하 이미지 파일만 업로드 가능합니다.");
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl("");
    setIsValid(false);
  };

  // 컴포넌트 언마운트 시에도 URL을 해제해야 메모리 누수 방지 가능
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      {/* 프로필 이미지 */}
      <CustomInputContainer
        label="프로필 이미지"
        isValid={isValid}
        isFocus={isFocused}
      >
        <div className="w-full flex flex-col justify-center items-center gap-4 p-4 pt-6">
          {/* 아이콘 or 이미지 미리보기 */}
          <div className="w-36 h-36 flex items-center justify-center border border-gray-300 rounded bg-gray-200 overflow-hidden relative">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="w-full h-full object-contain"
                />
                {/* 삭제 버튼 */}
                <div className="absolute top-2 right-2 w-6 h-6 flex justify-center items-center">
                  <button
                    onClick={handleRemoveImage}
                    className="w-full h-full flex justify-center items-center rounded-full bg-white p-1 text-gray-600 hover:text-warning shadow-md"
                    aria-label="이미지 삭제"
                  >
                    <RxCross2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <FaImage className="text-5xl text-gray-400" />
            )}
          </div>

          <p className="text-sm text-gray-500">
            <span className="italic">1MB </span>이하 이미지 파일만 업로드
            가능합니다.
          </p>

          {/* 파일 선택 버튼 */}
          <div className="w-9/12 flex items-center gap-5 bg-gray-100 rounded-lg p-2">
            <label className="text-ellipsis whitespace-nowrap px-4 py-2 border border-brand text-brand rounded-md cursor-pointer hover:bg-gray-200 transition">
              파일 선택
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="hidden"
              />
            </label>
            <p
              className="overflow-hidden max-w-96 text-sm text-gray-400 text-ellipsis whitespace-nowrap"
              title={image?.name}
            >
              {image ? image.name : "No File Chosen"}
            </p>
          </div>
        </div>
      </CustomInputContainer>
    </>
  );
};

export default ImageInput;
