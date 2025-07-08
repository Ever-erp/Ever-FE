import {
  ApiResponse,
  NoticeItem,
  NoticePageResponse,
  NoticeCreateRequest,
  NoticeUpdateRequest,
  NoticeEditorData,
  SearchType,
} from "../../types/notice";

// 단일 공지사항 조회
export const noticeSingleFetch = async (
  id: number | string,
  token: string
): Promise<NoticeItem> => {
  const requestInit: RequestInit = {
    credentials: "include",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}/${id}`,
      requestInit
    );

    if (200 <= response.status && response.status < 300) {
      const responseJson: ApiResponse<NoticeItem> = await response.json();
      return responseJson.data;
    } else {
      const errorJson = await response.json();
      const errorStatus = errorJson.status || response.status;
      const errorMessage = errorJson.message || response.statusText;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 공지사항 페이지 조회
export const noticePageFetch = async (
  page: number,
  size: number,
  token: string
): Promise<NoticePageResponse> => {
  const requestInit: RequestInit = {
    credentials: "include",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}?page=${page}&size=${size}`,
      requestInit
    );

    if (200 <= response.status && response.status < 300) {
      const responseJson: ApiResponse<NoticePageResponse> =
        await response.json();
      return responseJson.data;
    } else {
      const errorJson = await response.json();
      const errorStatus = errorJson.status || response.status;
      const errorMessage = errorJson.message || response.statusText;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const noticeSearchFetch = async (
  searchType: SearchType,
  text: string,
  page: number,
  size: number,
  token: string
): Promise<NoticePageResponse> => {
  const requestInit: RequestInit = {
    credentials: "include",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (searchType && searchType !== "ALL_CATEGORY") {
    params.append("searchType", searchType);
  }
  if (text && text.trim() !== "") {
    params.append("text", text.trim());
  }

  const url = `${import.meta.env.VITE_NOTICE_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, requestInit);

    if (200 <= response.status && response.status < 300) {
      const responseJson: ApiResponse<NoticePageResponse> =
        await response.json();
      return responseJson.data;
    } else {
      const errorJson = await response.json();
      const errorStatus = errorJson.status;
      const errorMessage = errorJson.message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 공지사항 생성
export const noticeCreateFetch = async (
  data: NoticeEditorData,
  token: string
): Promise<NoticeItem> => {
  const noticeBody: NoticeCreateRequest = {
    type: data.type,
    title: data.title,
    contents: data.contents,
    isPinned: data.isPinned !== undefined ? data.isPinned : false,
    targetRange: data.targetRange,
    targetDate: data.targetDate,
  };

  const requestInit: RequestInit = {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noticeBody),
  };

  try {
    const noticeResponse = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}`,
      requestInit
    );

    if (200 <= noticeResponse.status && noticeResponse.status < 300) {
      const responseJson: ApiResponse<NoticeItem> = await noticeResponse.json();
      return responseJson.data;
    } else {
      let errorMessage = `HTTP ${noticeResponse.status}: ${noticeResponse.statusText}`;
      try {
        const errorJson = await noticeResponse.json();
        errorMessage = `${errorJson.status || noticeResponse.status} : ${
          errorJson.message || noticeResponse.statusText
        }`;
      } catch (jsonError) {
        console.error(jsonError);
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 공지사항 수정
export const noticeUpdateFetch = async (
  noticeId: number | string,
  data: NoticeEditorData,
  token: string
): Promise<NoticeItem> => {
  const noticeBody: NoticeUpdateRequest = {
    type: data.type,
    title: data.title,
    contents: data.contents,
    isPinned: data.isPinned !== undefined ? data.isPinned : false,
    targetRange: data.targetRange,
    targetDate: data.targetDate,
  };

  const requestInit: RequestInit = {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noticeBody),
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}/${noticeId}`,
      requestInit
    );

    if (200 <= response.status && response.status < 300) {
      const responseJson: ApiResponse<NoticeItem> = await response.json();
      return responseJson.data;
    } else {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        errorMessage = `${errorJson.status || response.status} : ${
          errorJson.message || response.statusText
        }`;
      } catch (jsonError) {
        console.error(jsonError);
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 공지사항 삭제
export const noticeDeleteFetch = async (
  id: number | string,
  token: string
): Promise<boolean> => {
  const requestInit: RequestInit = {
    credentials: "include",
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}/${id}`,
      requestInit
    );

    if (200 <= response.status && response.status < 300) {
      const responseJson: ApiResponse<{}> = await response.json();
      if (200 <= responseJson.status && responseJson.status < 300) {
        return true;
      } else {
        return false;
      }
    } else {
      const errorJson = await response.json();
      const errorStatus = errorJson.status || response.status;
      const errorMessage = errorJson.message || response.statusText;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
