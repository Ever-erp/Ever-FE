import React, { useCallback, useEffect, useMemo } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlow,
  useReactFlow,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  FitViewOptions,
} from "reactflow";
import OrganizationNodeVertical from "./OrganizationNodeVertical";
import OrganizationNodeHorizontal from "./OrganizationNodeHorizontal";

interface ContainerSize {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface CalculatedPositions {
  root: Position;
  level2: Position[];
  level3: Position[];
}

interface OrganizationBodyProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  handleClassClick?: (id: number | string) => void;
  handleMemberClick?: (id: number | string) => void;
  handleInstructorClick?: (id: number | string) => void;
  containerSize?: ContainerSize;
  modalOpen?: boolean;
}

const nodeTypes = {
  organizationNode: OrganizationNodeVertical,
  organizationNodeVertical: OrganizationNodeVertical,
  organizationNodeHorizontal: OrganizationNodeHorizontal,
};

const OrganizationBody: React.FC<OrganizationBodyProps> = ({
  initialNodes,
  initialEdges,
  handleClassClick,
  handleMemberClick,
  handleInstructorClick,
  containerSize,
  modalOpen = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  useEffect(() => {
    if (nodes.length > 1 && !modalOpen) {
      const timeoutId = setTimeout(() => {
        const fitViewOptions: FitViewOptions = {
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.5,
        };
        fitView(fitViewOptions);
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [nodes.length, fitView, modalOpen]);

  const calculateNodePositions = useMemo(() => {
    return (
      containerWidth: number,
      containerHeight: number,
      level2Count: number = 5,
      level3Count: number = 5
    ): CalculatedPositions => {
      const centerX = containerWidth / 2;
      const topY = 50;
      const middleY = 200;
      const bottomY = 350;

      const minSpacing = 120;
      const maxSpacing = 180;

      // 각 레벨의 간격 계산 (화면 크기에 따라 조정)
      const availableWidth = Math.min(containerWidth - 200, 800); // 최대 폭 제한
      const level2Spacing =
        level2Count > 1
          ? Math.max(
              minSpacing,
              Math.min(maxSpacing, availableWidth / (level2Count - 1))
            )
          : 0;
      const level3Spacing =
        level3Count > 1
          ? Math.max(
              minSpacing,
              Math.min(maxSpacing, availableWidth / (level3Count - 1))
            )
          : 0;

      const level2StartX =
        level2Count > 1
          ? centerX - ((level2Count - 1) * level2Spacing) / 2
          : centerX;
      const level3StartX =
        level3Count > 1
          ? centerX - ((level3Count - 1) * level3Spacing) / 2
          : centerX - 80;

      const level2Positions: Position[] = [];
      const level3Positions: Position[] = [];

      for (let i = 0; i < level2Count; i++) {
        level2Positions.push({
          x: level2Count > 1 ? level2StartX + i * level2Spacing : level2StartX,
          y: middleY,
        });
      }

      for (let i = 0; i < level3Count; i++) {
        level3Positions.push({
          x: level3Count > 1 ? level3StartX + i * level3Spacing : level3StartX,
          y: bottomY,
        });
      }

      return {
        root: { x: centerX, y: topY },
        level2: level2Positions,
        level3: level3Positions,
      };
    };
  }, []);

  useEffect(() => {
    if (containerSize && containerSize.width && containerSize.height) {
      // 실제 노드 개수 계산
      const level2NodeCount = nodes.filter(
        (node) => parseInt(node.id) >= 11 && parseInt(node.id) <= 20
      ).length;
      const level3NodeCount = nodes.filter((node) =>
        node.id.startsWith("instructor-")
      ).length;

      const positions = calculateNodePositions(
        containerSize.width,
        containerSize.height,
        level2NodeCount,
        level3NodeCount
      );

      setNodes((nds) =>
        nds.map((node) => {
          let newPosition = node.position;

          if (node.id === "1") {
            newPosition = positions.root;
          } else if (parseInt(node.id) >= 11 && parseInt(node.id) <= 20) {
            // 레벨2 노드 (클래스) - 순서대로 배치
            const level2Nodes = nds
              .filter((n) => parseInt(n.id) >= 11 && parseInt(n.id) <= 20)
              .sort((a, b) => parseInt(a.id) - parseInt(b.id));
            const index = level2Nodes.findIndex((n) => n.id === node.id);
            if (positions.level2[index]) {
              newPosition = positions.level2[index];
            }
          } else if (node.id.startsWith("instructor-")) {
            // 레벨3 노드 (강사) - 담당 클래스와 같은 열에 배치
            const instructorClassId = parseInt(
              node.id.replace("instructor-", "")
            );
            const level2Nodes = nds
              .filter((n) => parseInt(n.id) >= 11 && parseInt(n.id) <= 20)
              .sort((a, b) => parseInt(a.id) - parseInt(b.id));
            const classIndex = level2Nodes.findIndex(
              (n) => parseInt(n.id) === instructorClassId + 10
            );
            if (positions.level3[classIndex]) {
              newPosition = positions.level3[classIndex];
            }
          }

          return {
            ...node,
            position: newPosition,
          };
        })
      );
    }
  }, [
    containerSize?.width,
    containerSize?.height,
    calculateNodePositions,
    nodes.length,
    setNodes,
  ]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // 강사 노드인 경우
      if (
        node.id.startsWith("instructor-") &&
        handleInstructorClick &&
        node.data?.id
      ) {
        handleInstructorClick(node.data.id);
      }
      // 클래스 노드인 경우 (id가 11-20 범위)
      else if (
        parseInt(node.id) >= 11 &&
        parseInt(node.id) <= 20 &&
        handleClassClick &&
        node.data?.id
      ) {
        handleClassClick(node.data.id);
      }
      // 멤버 노드인 경우 (기타 모든 노드)
      else if (handleMemberClick && node.data?.id) {
        handleMemberClick(node.data.id);
      }
    },
    [handleClassClick, handleMemberClick, handleInstructorClick]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => onNodesChange(changes),
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => onEdgesChange(changes),
    [onEdgesChange]
  );

  return (
    <div
      className="w-full h-full"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView={!modalOpen}
        proOptions={{ hideAttribution: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default OrganizationBody;
export type {
  OrganizationBodyProps,
  ContainerSize,
  Position,
  CalculatedPositions,
};
