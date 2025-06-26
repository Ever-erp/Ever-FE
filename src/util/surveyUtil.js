// 설문 관리 설정
const surveyConfig = {
  title: "설문",
  writeButtonText: "설문 작성",
  writeRoute: "/survey/write",
  detailRoute: "/survey",
  showWriteButton: true,
  columns: [
    { key: "id", label: "번호", width: "w-16", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "w-24",
      align: "center",
      render: "status",
    },
    {
      key: "surveyTitle",
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
    { key: "dueDate", label: "마감일", width: "w-28", align: "center" },
    { key: "createdAt", label: "생성일", width: "w-28", align: "center" },
  ],
  dataKeyMapping: {
    id: "surveyId",
    status: "status", // 설문 상태 (진행중, 완료)
    surveyTitle: "surveyTitle",
    questionCount: "surveySize",
    dueDate: "dueDate",
    createdAt: "createdAt",
  },
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

export { surveyConfig, getStatusBadgeColor };
