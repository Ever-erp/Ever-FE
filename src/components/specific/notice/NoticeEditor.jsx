import React, { useState, useEffect } from "react";
import FileUpload from "../../common/file/FileUpload";
import FileDisplay from "../../common/file/FileDisplay";
import CustomDropdown from "../../common/CustomDropdown";

const NoticeEditor = ({
  mode = "create", // create/edit
  initialData = {},
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [files, setFiles] = useState(initialData.files || []);
  const [noticeType, setNoticeType] = useState(initialData.type || "일반");
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    setTitle(initialData.title || "");
    setContent(initialData.content || "");
    setFiles(initialData.files || []);
    setNoticeType(initialData.type || "일반");
    setExistingFiles(initialData.files || []);
  }, [
    initialData.title,
    initialData.content,
    initialData.files,
    initialData.type,
  ]);

  const handleFileChange = (uploadedFiles) => {
    if (Array.isArray(uploadedFiles)) {
      setFiles(uploadedFiles);
    } else if (uploadedFiles) {
      setFiles([uploadedFiles]);
    } else {
      setFiles([]);
    }
  };

  const handleRemoveExistingFile = (fileIndex) => {
    const updatedFiles = existingFiles.filter(
      (_, index) => index !== fileIndex
    );
    setExistingFiles(updatedFiles);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const data = {
      title: title.trim(),
      content: content.trim(),
      files: [...existingFiles, ...files],
      type: noticeType,
    };

    onSave && onSave(data);
  };

  const handleCancel = () => {
    if (mode === "create") {
      if (title.trim() || content.trim() || files.length > 0) {
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

  const handleFileDownload = (file) => {
    console.log("downloading file:", file);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center justify-start w-full">
          <CustomDropdown
            options={[
              { value: "일반", label: "일반" },
              { value: "설문", label: "설문" },
            ]}
            value={noticeType}
            onChange={(e) => setNoticeType(e.target.value)}
            width="w-24"
            placeholder="구분"
          />
        </div>

        <div className="flex flex-row items-center justify-between w-full mt-4">
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
              <span className="text-lg">홍길동</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {mode === "create" ? "새 게시글" : initialData.date || ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 첨부파일 영역 */}
      <div className="w-full py-4 border-b-2 border-gray-300">
        <div className="w-full">
          <h4 className="text-sm font-medium text-gray-700 mb-2">첨부파일</h4>
          {mode === "edit" && existingFiles && existingFiles.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs text-gray-600 mb-2">기존 파일</h5>
              <div className="space-y-2">
                {existingFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">
                        {file.name || `파일 ${index + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <FileUpload
            onFileChange={handleFileChange}
            multiple={true}
            accept="*/*"
            disabled={isLoading}
            className=""
          />
        </div>
      </div>

      {/* 내용 영역 */}
      <div className="flex flex-col items-start justify-start flex-1 w-full p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none border border-gray-300 rounded-md p-4 focus:outline-none focus:border-brand text-base min-h-[400px]"
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
