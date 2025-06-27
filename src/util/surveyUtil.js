// 설문 관리 설정
const surveyConfig = {
  title: "설문",
  writeButtonText: "설문 작성",
  writeRoute: "/survey/write",
  detailRoute: "/survey",
  showWriteButton: true,
  showDeleteButton: true,
  columns: [
    { key: "id", label: "번호", width: "w-16", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "w-20",
      align: "center",
      render: "status",
    },
    {
      key: "className",
      label: "반",
      width: "w-24",
      align: "center",
      render: "className",
    },
    {
      key: "title",
      label: "제목",
      width: "flex-1",
      align: "left",
      paddingLeft: "pl-40",
    },
    {
      key: "questionCount",
      label: "질문 수",
      width: "w-28",
      align: "center",
    },
    {
      key: "responseRate",
      label: "응답률",
      width: "w-32",
      align: "center",
      render: "responseRate",
    },
    { key: "dueDate", label: "마감일", width: "w-28", align: "center" },
    { key: "createdAt", label: "생성일", width: "w-28", align: "center" },
  ],
  dataKeyMapping: {
    id: "surveyId",
    status: "status", // 설문 상태 (진행중, 완료)
    className: "className", // 반 정보
    title: "surveyTitle", // mock 데이터의 surveyTitle을 title로 매핑
    questionCount: "surveySize",
    responseRate: "responseRate", // 응답률 (계산된 값)
    dueDate: "dueDate",
    createdAt: "createdAt",
  },
};

// 데이터를 API 형식으로 변환하는 함수
const transformDataForAPI = (surveyData) => {
  const surveyQuestion = surveyData.questions.map((q) => q.question);
  const surveyQuestionMeta = surveyData.questions.map((q) => {
    if (q.type === "객관식") {
      return q.options.filter((option) => option.trim() !== "");
    } else {
      return []; // 주관식은 빈 배열
    }
  });

  return {
    surveyId: crypto.randomUUID(), // UUID 생성
    surveyTitle: surveyData.title,
    surveyDesc: surveyData.description,
    dueDate: surveyData.endDate,
    className: surveyData.targetRange, // 대상 범위 추가
    status: "진행중",
    surveySize: surveyData.questions.length,
    surveyQuestion: surveyQuestion,
    surveyQuestionMeta: surveyQuestionMeta,
  };
};

// 상태에 따른 배지 색상
const getStatusBadgeColor = (status) => {
  switch (status) {
    case "진행중":
      return "bg-blue-100 text-blue-600";
    case "완료":
      return "bg-green-100 text-green-600";
    case "작성중":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const parsedDate = (date) => {
  if (!date) return "";

  try {
    const dateObj = new Date(date);

    // 유효한 날짜인지 확인
    if (isNaN(dateObj.getTime())) {
      return date; // 파싱 실패 시 원본 반환
    }

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Date parsing error:", error);
    return date; // 에러 발생 시 원본 반환
  }
};

const parsedDateTime = (date) => {
  if (!date) return "";

  try {
    const dateObj = new Date(date);

    // 유효한 날짜인지 확인
    if (isNaN(dateObj.getTime())) {
      return date; // 파싱 실패 시 원본 반환
    }

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("DateTime parsing error:", error);
    return date; // 에러 발생 시 원본 반환
  }
};

export {
  surveyConfig,
  getStatusBadgeColor,
  transformDataForAPI,
  parsedDate,
  parsedDateTime,
};
