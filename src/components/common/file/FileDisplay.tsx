import React from "react";
import {
  FiFileText,
  FiImage,
  FiVideo,
  FiDownload,
  FiFile,
} from "react-icons/fi";
import { formatFileSize } from "../../../util/fileUtil";

const FileDisplay = ({
  files = [],
  onDownload,
  showDownloadButton = true,
  className = "",
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FiImage className="w-4 h-4 text-green-500" />;
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FiFileText className="w-4 h-4 text-blue-500" />;
      case "mp4":
      case "avi":
      case "mov":
        return <FiVideo className="w-4 h-4 text-purple-500" />;
      default:
        return <FiFile className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDownload = (file) => {
    if (onDownload) {
      onDownload(file);
    } else {
      const link = document.createElement("a");
      link.href = file.url || file.path;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700">첨부파일</h4>
      {files.map((file, index) => (
        <div
          key={`file-${index}`}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {getFileIcon(file.name)}
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </div>
          {showDownloadButton && (
            <button
              onClick={() => handleDownload(file)}
              className="p-2 text-gray-400 hover:text-brand transition-colors rounded-md hover:bg-white"
              title="다운로드"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileDisplay;
