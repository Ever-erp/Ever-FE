import React from "react";
import { useNavigate } from "react-router-dom";

const GenericPageRow = ({ data, config }) => {
  const navigate = useNavigate();

  const handleType = (type) => {
    switch (type) {
      case "일반":
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-2 py-2 text-xs font-medium">
            일반
          </div>
        );
      case "설문":
        return (
          <div className="text-brand border border-brand rounded-md px-2 py-2 text-xs font-medium">
            설문
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-2 py-2 text-xs font-medium">
            {type}
          </div>
        );
    }
  };
  const handleStatus = (status) => {
    switch (status) {
      case "진행중":
        return (
          <div className="text-green-600 border border-green-600 rounded-md px-1 py-1 text-xs font-medium">
            진행중
          </div>
        );
      case "완료":
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-1 py-1 text-xs font-medium">
            완료
          </div>
        );
      default:
        return (
          <div className="text-gray-500 border border-gray-300 rounded-md px-1 py-1 text-xs font-medium">
            {status}
          </div>
        );
    }
  };
  const handleRowClick = () => {
    const id = data[config.dataKeyMapping.id];
    navigate(`${config.detailRoute}/${id}`);
  };

  const renderCellContent = (column, data) => {
    let value = data[config.dataKeyMapping[column.key]];

    if (column.key === "id" && value.length > 5) {
      value = value.slice(0, 5);
    }

    switch (column.render) {
      case "badge":
        return handleType(value);
      case "status":
        return handleStatus(value);
      default:
        return value || "-";
    }
  };

  return (
    <div className="flex flex-row" onClick={handleRowClick}>
      {config.columns.map((column, index) => (
        <div
          key={index}
          className={`${column.width} text-${column.align} ${
            column.paddingLeft || ""
          } ${column.key === "type" ? "flex justify-center" : ""}`}
        >
          {renderCellContent(column, data)}
        </div>
      ))}
    </div>
  );
};

export default GenericPageRow;
