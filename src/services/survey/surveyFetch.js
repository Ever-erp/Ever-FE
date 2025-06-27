const singleSurveyFetch = async (surveyId, token) => {
  const url = `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

const surveyPageFetch = async (page, size, token) => {
  const url = `${import.meta.env.VITE_SURVEY_API_URL}/page?page=${
    page - 1
  }&size=${size}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

const surveyCreateFetch = async (surveyData, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SURVEY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(surveyData),
    });
    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      return responseJson;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

const surveyUpdateFetch = async (surveyId, surveyData, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}`,
      {
        method: "PATCH",
        body: JSON.stringify(surveyData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
    console.error("Error updating survey:", error);
    throw error;
  }
};

const surveyDeleteFetch = async (surveyId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
    console.error("Error deleting survey:", error);
    throw error;
  }
};

const surveyDeleteMultipleFetch = async (surveyIds, token) => {
  const body = {
    surveyIds: surveyIds,
  };
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/multiple`,
      {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
    console.error("Error deleting multiple surveys:", error);
    throw error;
  }
};

// 학생용
const findSurveyBySurveyIdAndMemberIdFetch = async (surveyId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (200 <= response.status && response.status < 300) {
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson.data;
    } else {
      const errorStatus = response.json().status;
      const errorMessage = response.json().message;
      throw new Error(`${errorStatus} : ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

const surveySubmitFetch = async (surveyId, surveyData, token) => {
  const answerList = surveyData.answers;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/submit`,
      {
        method: "POST",
        body: JSON.stringify({
          answerList: answerList,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
    console.error("Error submitting survey:", error);
    throw error;
  }
};

const surveySubmitUpdateFetch = async (surveyId, surveyData, token) => {
  console.log("surveyData : ", surveyData);
  const answerList = surveyData.answers;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/submit`,
      {
        method: "PATCH",
        body: JSON.stringify({
          answerList: answerList,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
    console.error("Error updating survey submission:", error);
    throw error;
  }
};

const surveyWithMemberAnswerFetch = async (surveyId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/members`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
    console.error("Error fetching survey with member answer:", error);
    throw error;
  }
};

export {
  singleSurveyFetch,
  surveyPageFetch,
  surveyCreateFetch,
  surveyUpdateFetch,
  surveyDeleteFetch,
  surveyDeleteMultipleFetch,
  surveySubmitFetch,
  surveySubmitUpdateFetch,
  findSurveyBySurveyIdAndMemberIdFetch,
  surveyWithMemberAnswerFetch,
};
