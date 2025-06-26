const noticeConfig = {
  title: "게시글",
  writeButtonText: "글 쓰기",
  writeRoute: "/notice/write",
  detailRoute: "/notice",
  showWriteButton: true,
  columns: [
    { key: "id", label: "번호", width: "w-16", align: "center" },
    {
      key: "type",
      label: "구분",
      width: "w-24",
      align: "center",
      render: "badge",
    },
    {
      key: "title",
      label: "제목",
      width: "flex-1",
      align: "left",
      paddingLeft: "pl-40",
    },
    { key: "writer", label: "작성자", width: "flex-1", align: "center" },
    { key: "createdAt", label: "게시일", width: "w-28", align: "center" },
  ],
  dataKeyMapping: {
    id: "id",
    type: "type",
    title: "title",
    writer: "writer",
    createdAt: "targetDate",
  },
};

export { noticeConfig };
