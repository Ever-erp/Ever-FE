const noticeSingleFetch = async (id, token) => {
  const requestInit = {
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
      const responseJson = await response.json();
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

const noticePageFetch = async (page, size, token) => {
  const requestInit = {
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
      const responseJson = await response.json();
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

const noticeSearchFetch = async (
  targetRange,
  type,
  searchInput,
  page,
  size,
  token
) => {
  const requestInit = {
    credentials: "include",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const input = searchInput ? searchInput : "empty";
  const url = `${
    import.meta.env.VITE_NOTICE_API_URL
  }/search?targetRange=${targetRange}&type=${type}&input=${input}&page=${page}&size=${size}`;
  console.log(url);
  try {
    const response = await fetch(url, requestInit);
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
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

/*
noticeType,
  noticeTitle,
  noticeContent,
  noticeFile,
  noticeImage,
  noticePin,
  noticeTargetRange,
  noticeTargetDate
*/
const noticeCreateFetch = async (data, token) => {
  const noticeBody = {
    type: data.type,
    title: data.title,
    contents: data.contents,
    // noticeFile: data.files,
    // noticeImage: data.image,
    isPinned: data.isPinned !== undefined ? data.isPinned : false,
    targetRange: data.targetRange,
    targetDate: data.targetDate,
  };

  const requestInit = {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noticeBody),
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}`,
      requestInit
    );

    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
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

const noticeUpdateFetch = async (noticeId, data, token) => {
  const noticeBody = {
    type: data.type,
    title: data.title,
    contents: data.contents,
    // noticeFile: data.files,
    // noticeImage: data.image,
    isPinned: data.isPinned !== undefined ? data.isPinned : false,
    targetRange: data.targetRange,
    targetDate: data.targetDate,
  };

  const requestInit = {
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
      const responseJson = await response.json();
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

const noticeDeleteFetch = async (id, token) => {
  const requestInit = {
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
    console.log(response);
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
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

export {
  noticeSingleFetch,
  noticePageFetch,
  noticeSearchFetch,
  noticeCreateFetch,
  noticeUpdateFetch,
  noticeDeleteFetch,
};
