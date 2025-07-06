import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "../../../types/organization";

const OrganizationNodeHorizontal: React.FC<NodeProps<NodeData>> = ({
  data,
}) => {
  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-4 shadow-lg min-w-[200px] text-center">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#10b981" }}
      />
      <div className="flex flex-col items-center">
        <div className="font-semibold text-sm text-gray-800 mb-1">
          {data.name}
        </div>
        {data.email && (
          <div className="text-xs text-gray-600 mb-1">{data.email}</div>
        )}
        {data.position && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {data.position}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#10b981" }}
      />
    </div>
  );
};

export default OrganizationNodeHorizontal;
