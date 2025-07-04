import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { noticeCreateFetch } from "../services/notice/noticeFetch";
import NoticeEditor from "../components/specific/notice/NoticeEditor";
import { useSelector } from "react-redux";
import { useAuthFetch } from "../hooks/useAuthFetch";

const WritePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const { isAuthenticated } = useAuthFetch();

  const handleSave = async (data) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      await noticeCreateFetch(data, token);

      alert("게시글이 작성되었습니다.");
      navigate("/notice"); // 공지사항 목록으로 이동
    } catch (error) {
      console.error("작성 중 오류 발생:", error);
      alert("작성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/notice"); // 공지사항 목록으로 이동
  };

  return (
    <div className="h-full w-full">
      <NoticeEditor
        mode="create"
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WritePage;
