import React, { useState, useRef } from "react";
import { FiFile, FiImage, FiUpload, FiX } from "react-icons/fi";
import { formatFileSize } from "../../../util/fileUtil";

const FileUpload = ({
  onFileChange,
  accept = "*/*",
  maxSize = 1024 * 1024 * 5, // 5MB
  multiple = false,
  disabled = false,
  className = "",
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        alert(
          `${file.name}은 최대 크기인 ${maxSize / 1024 / 1024}MB를 초과합니다.`
        );
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
      onFileChange && onFileChange([...files, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
      onFileChange && onFileChange(validFiles[0] || null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = () => {
    e.preventDefault();
    if (!disabled) setDragOver(false);
  };

  const handleInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (multiple) {
      onFileChange && onFileChange(newFiles);
    } else {
      onFileChange && onFileChange(null);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return <FiImage className="w-4 h-4" />;
    }
    return <FiFile className="w-4 h-4" />;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 파일 드롭 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragOver
            ? "border-brand bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          파일을 드래그하여 업로드하거나 클릭하여 선택하세요
        </p>
        <p className="text-xs text-gray-400">
          최대 {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* 선택된 파일 목록 */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">선택된 파일</h4>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                disabled={disabled}
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
