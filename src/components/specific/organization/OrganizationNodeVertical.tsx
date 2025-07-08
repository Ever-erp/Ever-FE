import React from "react";
import { Handle, Position } from "reactflow";

// TypeScript 타입 정의
interface NodeData {
  id?: number | string;
  name: string;
  position?: string;
  department?: string;
  team?: string;
  role?: string;
}

interface OrganizationNodeVerticalProps {
  data: NodeData;
  isConnectable: boolean;
}

// 커스텀 노드 컴포넌트 (상하 연결용 - Organization.jsx용)
const OrganizationNodeVertical: React.FC<OrganizationNodeVerticalProps> = ({
  data,
  isConnectable,
}) => {
  return (
    <div className="px-5 py-4 shadow-lg rounded-lg bg-white border-2 border-gray-300 min-w-[160px] max-w-[200px] hover:shadow-xl transition-shadow duration-200">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-teal-500 border-2 border-white"
      />
      <div className="flex flex-col items-center text-center">
        <div className="text-base font-bold text-gray-800 mb-1 leading-tight">
          {data.name}
        </div>
        {data.position && (
          <div className="text-sm text-gray-600 mb-1">{data.position}</div>
        )}
        {data.department && (
          <div className="text-xs text-gray-500 mb-1">{data.department}</div>
        )}
        {data.team && (
          <div className="text-xs text-blue-600 font-medium">{data.team}</div>
        )}
        {data.role && (
          <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mt-1">
            {data.role}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-teal-500 border-2 border-white"
      />
    </div>
  );
};

export default OrganizationNodeVertical;
export type { NodeData, OrganizationNodeVerticalProps };
