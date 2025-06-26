import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  noticeSingleFetch,
  noticeUpdateFetch,
  noticeDeleteFetch,
} from "../services/notice/noticeFetch";
import FileDisplay from "../components/common/file/FileDisplay";
import NoticeEditor from "../components/specific/notice/NoticeEditor";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";

const SingleNotice = () => {
  const { noticeId } = useParams();
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeWriter, setNoticeWriter] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [noticeType, setNoticeType] = useState("");
  const [noticePin, setNoticePin] = useState(false);
  const [noticeFiles, setNoticeFiles] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  // 수정 모드 관련 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuthFetch();

  // resFile은 배열이어야 함.
  const handleFile = (resFiles) => {
    if (resFiles && resFiles.length > 0 && Array.isArray(resFiles)) {
      setNoticeFiles(resFiles);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteMode(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("accessToken");
    await noticeDeleteFetch(noticeId, token);
    setIsDeleteMode(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteMode(false);
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await noticeUpdateFetch(noticeId, data, token);

      setNoticeTitle(data.title);
      setNoticeContent(data.content);
      setNoticeFiles(data.files);
      setNoticeType(data.type);
      setIsEditMode(false);
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await noticeSingleFetch(noticeId, token);

        setNoticeTitle(res.title);
        setNoticeContent(res.contents);
        setNoticeWriter(res.writer);
        setNoticeDate(res.targetDate || res.createdAt || res.registedAt);
        setNoticeType(res.type);
        setNoticePin(res.pinned || res.pin);
        handleFile(res.files || []);
      } catch (error) {
        console.error("공지사항 로딩 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeData();
  }, [noticeId]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL이 복사되었습니다.");
  };

  const handleFileDownload = (file) => {
    console.log("downloading file : ", file);
  };

  if (loading) {
    return <Loading text="공지사항을 불러오고 있습니다..." />;
  }

  if (isEditMode) {
    const initialData = {
      title: noticeTitle,
      content: noticeContent,
      files: noticeFiles,
      type: noticeType,
      writer: noticeWriter,
      date: noticeDate,
    };

    return (
      <NoticeEditor
        mode="edit"
        initialData={initialData}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={loading}
      />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* 삭제 확인 모달 */}
      {isDeleteMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-modalSlideIn">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">게시글 삭제</h3>
              <p className="text-gray-600 mb-6">
                정말로 이 게시글을 삭제하시겠습니까?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  onClick={handleDeleteCancel}
                >
                  취소
                </button>
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
                  onClick={handleDeleteConfirm}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 영역 */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center justify-start w-full">
          <a className="text-sm text-brand mt-2">{noticeType}</a>
        </div>
        <div className="flex flex-row items-center justify-between w-full mt-4">
          <div className="flex-1 h-12 flex items-center">
            <div className="flex items-center w-full h-10">
              <span className="text-2xl font-bold mr-2">제목 : </span>
              <span className="text-2xl font-bold">{noticeTitle}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full border-b-2 border-gray-300 pb-4 mt-4">
          <div>
            <div>
              <a className="text-lg">{noticeWriter}</a>
            </div>
            <div>
              <a className="text-sm text-gray-500">{noticeDate}</a>
            </div>
          </div>
          <div>
            <a
              className="border-2 border-brand rounded-md p-2 hover:bg-brand hover:text-white cursor-pointer"
              onClick={copyUrl}
            >
              URL 복사
            </a>
          </div>
        </div>
      </div>
      {noticeFiles.length > 0 && (
        <div className="w-full py-4 border-b-2 border-gray-300">
          <div className="w-full">
            <FileDisplay
              files={noticeFiles}
              onDownload={handleFileDownload}
              className=""
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-start justify-start flex-1 w-full p-4">
        <div className="w-full h-full overflow-auto">
          <p className="whitespace-pre-wrap text-base">{noticeContent}</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end w-full py-4 gap-2">
        <button
          className="bg-white text-brand px-10 py-2 rounded-md border border-brand hover:bg-brand hover:text-white transition-colors"
          onClick={handleEditClick}
        >
          글 수정
        </button>
        <button
          className="bg-brand text-white px-10 py-2 rounded-md border border-brand hover:bg-red-600 hover:text-white transition-colors"
          onClick={handleDeleteClick}
        >
          글 삭제
        </button>
      </div>
    </div>
  );
};

export default SingleNotice;
