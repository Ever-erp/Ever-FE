import {
  ApiResponse,
  SurveyItem,
  SurveyPageResponse,
  SurveyCreateRequest,
  SurveyUpdateRequest,
  SurveyAnswerRequest,
  SurveyMultipleDeleteRequest,
  SurveyUserResponse,
  SurveyMembersResponse,
} from "../../types/survey";

const singleSurveyFetch = async (
  surveyId: string,
  token: string
): Promise<SurveyItem> => {
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
      const responseJson: ApiResponse<SurveyItem> = await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

const surveyPageFetch = async (
  page: number,
  size: number,
  token: string
): Promise<SurveyPageResponse> => {
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
      const responseJson: ApiResponse<SurveyPageResponse> =
        await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

const surveyCreateFetch = async (
  surveyData: SurveyCreateRequest,
  token: string
): Promise<ApiResponse> => {
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
      const responseJson: ApiResponse = await response.json();
      return responseJson;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

const surveyUpdateFetch = async (
  surveyId: string,
  surveyData: SurveyUpdateRequest,
  token: string
): Promise<any> => {
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
      const responseJson: ApiResponse = await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error updating survey:", error);
    throw error;
  }
};

const surveyDeleteFetch = async (
  surveyId: string,
  token: string
): Promise<any> => {
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
      const responseJson: ApiResponse = await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error deleting survey:", error);
    throw error;
  }
};

const surveyDeleteMultipleFetch = async (
  surveyIds: string[],
  token: string
): Promise<any> => {
  const body: SurveyMultipleDeleteRequest = {
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
      const responseJson: ApiResponse = await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error deleting multiple surveys:", error);
    throw error;
  }
};

// 학생용
const findSurveyBySurveyIdAndMemberIdFetch = async (
  surveyId: string,
  token: string
): Promise<SurveyUserResponse> => {
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
      const responseJson: ApiResponse<SurveyUserResponse> =
        await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

interface SurveySubmitData {
  answers: string[];
}

const surveySubmitFetch = async (
  surveyId: string,
  surveyData: SurveySubmitData,
  token: string
): Promise<any> => {
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
      const responseJson: ApiResponse = await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
};

const surveySubmitUpdateFetch = async (
  surveyId: string,
  surveyData: SurveySubmitData,
  token: string
): Promise<any> => {
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
      const responseJson: ApiResponse = await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
    }
  } catch (error) {
    console.error("Error updating survey submission:", error);
    throw error;
  }
};

const surveyWithMemberAnswerFetch = async (
  surveyId: string,
  token: string
): Promise<SurveyMembersResponse> => {
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
      const responseJson: ApiResponse<SurveyMembersResponse> =
        await response.json();
      return responseJson.data;
    } else {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.status} : ${errorResponse.message}`);
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
