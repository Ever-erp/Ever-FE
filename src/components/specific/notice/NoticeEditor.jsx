import React, { useState, useEffect } from "react";
// import FileUpload from "../../common/file/FileUpload";
import FileDisplay from "../../common/file/FileDisplay";
import CustomDropdown from "../../common/CustomDropdown";
import { useAuthFetch } from "../../../hooks/useAuthFetch";
import { useSelector } from "react-redux";

const NoticeEditor = ({
  mode = "create", // create/edit
  initialData = {},
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [contents, setContents] = useState(initialData.contents || "");
  const [isPinned, setIsPinned] = useState(initialData.isPinned || false);
  const [targetRange, setTargetRange] = useState(
    initialData.targetRange || "ALL_TARGETRANGE"
  );
  const [targetDate, setTargetDate] = useState(initialData.targetDate || "");
  const [files, setFiles] = useState(initialData.files || []);
  const [noticeType, setNoticeType] = useState(initialData.type || "ALL_TYPE");
  const [existingFiles, setExistingFiles] = useState([]);

  const { isAuthenticated } = useAuthFetch();
  const user = useSelector((state) => state.user.user);

  // 타입 옵션 정의
  const typeOptions = [
    { value: "ALL_TYPE", label: "전체" },
    { value: "NOTICE", label: "공지" },
    { value: "SURVEY", label: "설문" },
  ];

  // 대상 범위 옵션 정의
  const targetRangeOptions = [
    { value: "ALL_TARGETRANGE", label: "전체" },
    { value: "WEB_APP", label: "웹/앱" },
    { value: "SMART_FACTORY", label: "스마트 팩토리" },
    { value: "SW_EMBEDDED", label: "SW 임베디드" },
    { value: "IT_SECURITY", label: "IT 보안" },
    { value: "CLOUD", label: "클라우드 서비스" },
  ];

  useEffect(() => {
    setTitle(initialData.title || "");
    setContents(initialData.contents || "");
    setIsPinned(initialData.isPinned || false);
    setTargetRange(initialData.targetRange || "ALL_TARGETRANGE");
    setTargetDate(initialData.targetDate || "");
    setFiles(initialData.files || []);
    setNoticeType(initialData.type || "ALL_TYPE");
    setExistingFiles(initialData.files || []);
  }, [
    initialData.title,
    initialData.contents,
    initialData.isPinned,
    initialData.targetRange,
    initialData.targetDate,
    initialData.files,
    initialData.type,
  ]);

  // const handleFileChange = (uploadedFiles) => {
  //   if (Array.isArray(uploadedFiles)) {
  //     setFiles(uploadedFiles);
  //   } else if (uploadedFiles) {
  //     setFiles([uploadedFiles]);
  //   } else {
  //     setFiles([]);
  //   }
  // };

  // const handleRemoveExistingFile = (fileIndex) => {
  //   const updatedFiles = existingFiles.filter(
  //     (_, index) => index !== fileIndex
  //   );
  //   setExistingFiles(updatedFiles);
  // };

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!contents.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const data = {
      title: title.trim(),
      contents: contents.trim(),
      isPinned: isPinned,
      files: files,
      targetRange: targetRange,
      targetDate: targetDate,
      type: noticeType,
      // files: [...existingFiles, ...files],
    };

    onSave && onSave(data);
  };

  const handleCancel = () => {
    if (mode === "create") {
      if (title.trim() || contents.trim() || files.length > 0) {
        if (
          window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")
        ) {
          onCancel && onCancel();
        }
      } else {
        onCancel && onCancel();
      }
    } else {
      onCancel && onCancel();
    }
  };

  const handleFileDownload = (file) => {};

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // 사용자 이름 표시 로직

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col w-full">
        {/* 타입과 대상 범위 선택 영역 */}
        <div className="flex flex-row items-center justify-start w-full gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              구분
            </label>
            <CustomDropdown
              options={typeOptions}
              value={noticeType}
              onChange={(value) => setNoticeType(value)}
              width="w-32"
              placeholder="구분"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              대상 범위
            </label>
            <CustomDropdown
              options={targetRangeOptions}
              value={targetRange}
              onChange={(value) => setTargetRange(value)}
              width="w-40"
              placeholder="대상 범위"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              대상 날짜
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={getTodayDate()}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-brand w-40"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              최상단 고정
            </label>
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                id="isPinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand focus:ring-2"
                disabled={isLoading}
              />
              <label
                htmlFor="isPinned"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                상단 고정
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between w-full mt-6">
          <div className="flex-1 h-12 flex items-center">
            <div className="flex items-center w-full">
              <span className="text-2xl font-bold mr-2">제목 : </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border border-gray-300 rounded-md px-3 h-10 focus:outline-none focus:border-brand max-w-md"
                placeholder="제목을 입력하세요"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between w-full border-b-2 border-gray-300 pb-4 mt-4">
          <div>
            <div>
              <span className="text-lg">{user.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {mode === "create" ? "새 게시글" : initialData.date || ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 파일 업로드 기능 비활성화로 인해 첨부파일 영역 제거 */}

      {/* 내용 영역 */}
      <div className="flex flex-col items-start justify-start flex-1 w-full p-4">
        <textarea
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          className="w-full h-[200px] resize-none border border-gray-300 rounded-md p-4 focus:outline-none focus:border-brand text-base min-h-[150px]"
          placeholder="내용을 입력하세요"
          disabled={isLoading}
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-row items-center justify-end w-full py-4 gap-2">
        <button
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
          onClick={handleCancel}
          disabled={isLoading}
        >
          취소
        </button>
        <button
          className="bg-brand text-white px-6 py-2 rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : mode === "create" ? "작성" : "저장"}
        </button>
      </div>
    </div>
  );
};

export default NoticeEditor;
