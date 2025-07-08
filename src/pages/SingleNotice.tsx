import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  noticeSingleFetch,
  noticeUpdateFetch,
  noticeDeleteFetch,
} from "../services/notice/noticeFetch";
// import FileDisplay from "../components/common/file/FileDisplay";
import NoticeEditor from "../components/specific/notice/NoticeEditor";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import { useSelector } from "react-redux";
import {
  NoticeType,
  NoticeEditorData,
  NoticeItem,
  TargetRange,
} from "../types/notice";

interface RootState {
  user: {
    user: {
      name: string;
      position: string;
    };
  };
}

const SingleNotice: React.FC = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const [noticeData, setNoticeData] = useState<NoticeItem | null>(null);
  const [noticeTitle, setNoticeTitle] = useState<string>("");
  const [noticeContent, setNoticeContent] = useState<string>("");
  const [noticeWriter, setNoticeWriter] = useState<string>("");
  const [noticeDate, setNoticeDate] = useState<string>("");
  const [noticeType, setNoticeType] = useState<NoticeType>("ALL_TYPE");
  const [noticePin, setNoticePin] = useState<boolean>(false);
  const [noticeFiles, setNoticeFiles] = useState<File[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  // 수정 모드 관련 상태
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [noticeTargetRange, setNoticeTargetRange] =
    useState<TargetRange>("ALL_TARGETRANGE");

  const navigate = useNavigate();

  const { isAuthenticated } = useAuthFetch();
  const user = useSelector((state: RootState) => state.user.user);

  // resFile은 배열이어야 함.
  // const handleFile = (resFiles: File[]) => {
  //   if (resFiles && resFiles.length > 0 && Array.isArray(resFiles)) {
  //     setNoticeFiles(resFiles);
  //   }
  // };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteMode(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noticeId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await noticeDeleteFetch(noticeId, token);
      setIsDeleteMode(false);
      alert("삭제가 완료되었습니다.");
      navigate("/notice");
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteMode(false);
  };

  const handleSave = async (data: NoticeEditorData) => {
    if (!noticeId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      await noticeUpdateFetch(noticeId, data, token);

      setNoticeTitle(data.title);
      setNoticeContent(data.contents);
      // setNoticeFiles(data.files);
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
      if (!noticeId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await noticeSingleFetch(noticeId, token);

        setNoticeData(res);
        setNoticeTitle(res.title);
        setNoticeContent(res.contents);
        setNoticeWriter(res.writer);
        setNoticeDate(res.targetDate || res.registedAt);
        setNoticeType(res.type);
        setNoticePin(res.pinned);
        setNoticeTargetRange(res.targetRange);
        // handleFile(res.files || []);
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

  const handleFileDownload = (file: File) => {
    //console.log("downloading file : ", file);
  };

  if (loading) {
    return <Loading text="공지사항을 불러오고 있습니다..." />;
  }

  if (isEditMode) {
    const initialData: NoticeEditorData = {
      title: noticeTitle,
      contents: noticeContent,
      files: noticeFiles,
      type: noticeType,
      targetRange: noticeTargetRange,
      targetDate: noticeDate,
      isPinned: noticePin,
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
      {isDeleteMode && user.position === "관리자" && (
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
      {/* 파일 업로드 기능 비활성화로 인해 파일 표시 영역 제거 */}
      {/* 
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
      */}

      <div className="flex flex-col items-start justify-start flex-1 w-full p-4">
        <div className="w-full h-full overflow-auto">
          <p className="whitespace-pre-wrap text-base">{noticeContent}</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end w-full py-4 gap-2">
        {user.position === "관리자" && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SingleNotice;
