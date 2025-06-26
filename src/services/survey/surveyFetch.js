// 관리자용
// const singleSurveyFetch = async (surveyId) => {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_SURVEY_API_URL}/survey/${surveyId}`
//     );

//     if (200 <= response.status && response.status < 300) {
//       const responseJson = await response.json();
//       return responseJson.data;
//     } else {
//       const errorStatus = response.json().status;
//       const errorMessage = response.json().message;
//       throw new Error(`${errorStatus} : ${errorMessage}`);
//     }
//   } catch (error) {
//     console.error("Error fetching survey:", error);
//     throw error;
//   }
// };

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

const surveyDeleteMultipleFetch = async (surveyIds) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/multiple`,
      {
        method: "DELETE",
        body: JSON.stringify(surveyIds),
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
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/submit`,
      {
        method: "POST",
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
    console.error("Error submitting survey:", error);
    throw error;
  }
};

const surveySubmitUpdateFetch = async (surveyId, surveyData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/submit`,
      {
        method: "PATCH",
        body: JSON.stringify(surveyData),
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

const surveyWithMemberAnswerFetch = async (surveyId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SURVEY_API_URL}/${surveyId}/members`
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
};

// survey list mock data
// 0. survey_id 설문 아이디 - uuid / hashcode
// 1. survey_title 제목
// 2. survey_desc 설명
// 3. due_date
// 4. survey_size 질문갯수

const surveyListMockData = {
  content: [
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174000",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174001",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174002",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174003",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174004",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174005",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174006",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
    },
  ],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      empty: true,
      sorted: true,
      unsorted: false,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: false,
  totalElements: 42,
  totalPages: 5,
  first: true,
  size: 10,
  numberOfElements: 7,
  empty: false,
};

// survey mock data
// 0. survey_id 설문 아이디 - uuid / hashcode
// 1. survey_title 제목
// 2. survey_desc 설명
// 3. due_date
// 4. survey_size 질문갯수
// 5. survey_question 질문 - 배열
// 6. survey_question_meta 질문타입 - 배열

const surveyMockData = {
  surveyList: [
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174000",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174001",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174002",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174003",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174004",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174005",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "진행중",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
    {
      surveyId: "123e4567-e89b-12d3-a456-426614174006",
      surveyTitle: "설문조사 제목",
      surveyDesc: "설문조사 설명",
      dueDate: "2025-06-25",
      status: "완료",
      surveySize: 3,
      createdAt: "2025-06-25",
      surveyQuestion: ["질문1", "질문2", "질문3"],
      surveyQuestionMeta: [
        ["좋아요", "중간", "싫어요"],
        ["주관식"],
        ["좋아요", "중간", "싫어요"],
      ],
    },
  ],
};

// survey submit mock data
// 0. survey_id 설문 아이디 - uuid / hashcode
const surveySubmitMockData = {
  survey: {
    surveyId: "123e4567-e89b-12d3-a456-426614174000",
    surveyTitle: "설문조사 제목",
    surveyDesc: "설문조사 설명",
    dueDate: "2025-06-25",
    status: "진행중",
    surveySize: 3,
    createdAt: "2025-06-25",
    surveyQuestion: ["질문1", "질문2", "질문3"],
    surveyQuestionMeta: [
      ["좋아요", "중간", "싫어요"],
      ["주관식"],
      ["좋아요", "중간", "싫어요"],
    ],
  },
  surveySubmit: {
    memberName: "홍길동",
    answer: ["1", "아주 좋았습니다.", "3"],
  },
};

const surveySubmitMultipleMockData = {
  surveyList: [
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174000",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "6",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174001",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "6",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174002",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "6",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174003",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174004",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "6",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174005",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "6",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
    {
      survey: {
        surveyId: "123e4567-e89b-12d3-a456-426614174006",
        surveyTitle: "설문조사 제목",
        surveyDesc: "설문조사 설명",
        dueDate: "2025-06-25",
        status: "진행중",
        surveySize: 3,
        createdAt: "2025-06-25",
        surveyQuestion: ["질문1", "질문2", "질문3"],
        surveyQuestionMeta: [
          ["좋아요", "중간", "싫어요"],
          ["주관식"],
          ["좋아요", "중간", "싫어요"],
        ],
      },
      surveySubmit: [
        {
          memberName: "홍길동",
          memberId: "1",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "2",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "3",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "4",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "5",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "6",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "7",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "8",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "9",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "10",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "11",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "12",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "13",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "14",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "15",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "16",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "17",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "18",
          answer: ["3", "보통입니다.", "2"],
        },
        {
          memberName: "홍길동",
          memberId: "19",
          answer: ["1", "아주 좋았습니다.", "3"],
        },
        {
          memberName: "이순신",
          memberId: "20",
          answer: ["2", "좋았습니다.", "2"],
        },
        {
          memberName: "강감찬",
          memberId: "21",
          answer: ["3", "보통입니다.", "2"],
        },
      ],
    },
  ],
};
