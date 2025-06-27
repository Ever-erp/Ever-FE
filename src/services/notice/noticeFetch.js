const noticeSingleFetch = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_NOTICE_API_URL}/${id}`
    );
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const noticePageFetch = async (page, size) => {
  try {
    const url = new URL(`${import.meta.env.VITE_NOTICE_API_URL}/page`);
    url.searchParams.set("page", page);
    url.searchParams.set("size", size);

    const response = await fetch(url);

    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();

      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const noticeSearchFetch = async (category, searchInput) => {
  try {
    const url = new URL(`${import.meta.env.VITE_NOTICE_API_URL}`);
    url.searchParams.set("field", category);
    url.searchParams.set("input", searchInput);

    const response = await fetch(url);

    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const noticeCreateFetch = async (
  noticeType,
  noticeTitle,
  noticeContent,
  noticeFile,
  noticeImage,
  noticePin,
  noticeTargetRange,
  noticeTargetDate
) => {
  const noticeBody = {
    noticeType,
    noticeTitle,
    noticeContent,
    noticeFile,
    noticeImage,
    noticePin,
    noticeTargetRange,
    noticeTargetDate,
  };

  const requestInit = {
    credentials: "include",
    mehtod: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticeBody),
  };

  try {
    const response = await fetch(`${process.env.NOTICE_API_URL}`, requestInit);
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const noticeUpdateFetch = async (
  id,
  noticeType,
  noticeTitle,
  noticeContent,
  noticeFile,
  noticeImage,
  noticePin,
  noticeTargetRange,
  noticeTargetDate
) => {
  const noticeBody = {
    noticeType,
    noticeTitle,
    noticeContent,
    noticeFile,
    noticeImage,
    noticePin,
    noticeTargetRange,
    noticeTargetDate,
  };

  const requestInit = {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticeBody),
  };

  try {
    const response = await fetch(
      `${process.env.NOTICE_API_URL}/${id}`,
      requestInit
    );
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const noticeDeleteFetch = async (id) => {
  const requestInit = {
    credentials: "include",
    method: "DELETE",
  };

  try {
    const response = await fetch(
      `${process.env.NOTICE_API_URL}/${id}`,
      requestInit
    );
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      if (200 <= responseJson.status && responseJson.status < 300) {
        return true;
      } else {
        return false;
      }
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
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
