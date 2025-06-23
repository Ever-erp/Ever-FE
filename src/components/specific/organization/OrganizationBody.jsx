import React, { useCallback, useEffect, useMemo } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlow,
  useReactFlow,
} from "reactflow";
import OrganizationNodeVertical from "./OrganizationNodeVertical";
import OrganizationNodeHorizontal from "./OrganizationNodeHorizontal";

const nodeTypes = {
  organizationNode: OrganizationNodeVertical,
  organizationNodeVertical: OrganizationNodeVertical,
  organizationNodeHorizontal: OrganizationNodeHorizontal,
};

const OrganizationBody = ({
  initialNodes,
  initialEdges,
  handleClassClick,
  handleMemberClick,
  containerSize,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges]);

  useEffect(() => {
    if (nodes.length > 1) {
      const timeoutId = setTimeout(() => {
        fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.5,
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [nodes.length, fitView]);

  const calculateNodePositions = useMemo(() => {
    return (containerWidth, containerHeight) => {
      const centerX = containerWidth / 2;
      const topY = 50;
      const middleY = 200;
      const bottomY = 350;

      const level2Count = 5;
      const level3Count = 5;

      const minSpacing = 120;
      const maxSpacing = 180;

      // 각 레벨의 간격 계산 (화면 크기에 따라 조정)
      const availableWidth = Math.min(containerWidth - 200, 800); // 최대 폭 제한
      const level2Spacing = Math.max(
        minSpacing,
        Math.min(maxSpacing, availableWidth / (level2Count - 1))
      );
      const level3Spacing = Math.max(
        minSpacing,
        Math.min(maxSpacing, availableWidth / (level3Count - 1))
      );

      const level2StartX = centerX - ((level2Count - 1) * level2Spacing) / 2;
      const level3StartX = centerX - ((level3Count - 1) * level3Spacing) / 2;

      return {
        root: { x: centerX - 80, y: topY },
        level2: [
          { x: level2StartX, y: middleY },
          { x: level2StartX + level2Spacing, y: middleY },
          { x: level2StartX + level2Spacing * 2, y: middleY },
          { x: level2StartX + level2Spacing * 3, y: middleY },
          { x: level2StartX + level2Spacing * 4, y: middleY },
        ],
        level3: [
          { x: level3StartX, y: bottomY },
          { x: level3StartX + level3Spacing, y: bottomY },
          { x: level3StartX + level3Spacing * 2, y: bottomY },
          { x: level3StartX + level3Spacing * 3, y: bottomY },
          { x: level3StartX + level3Spacing * 4, y: bottomY },
        ],
      };
    };
  }, []);

  useEffect(() => {
    if (containerSize && containerSize.width && containerSize.height) {
      const positions = calculateNodePositions(
        containerSize.width,
        containerSize.height
      );

      setNodes((nds) =>
        nds.map((node) => {
          let newPosition = node.position;

          if (node.id === "1") {
            newPosition = positions.root;
          } else if (parseInt(node.id) >= 11 && parseInt(node.id) <= 15) {
            // 레벨2 노드 (클래스)
            const index = parseInt(node.id) - 11;
            if (positions.level2[index]) {
              newPosition = positions.level2[index];
            }
          } else if (parseInt(node.id) >= 21 && parseInt(node.id) <= 25) {
            // 레벨3 노드 (강사)
            const index = parseInt(node.id) - 21;
            if (positions.level3[index]) {
              newPosition = positions.level3[index];
            }
          }

          return {
            ...node,
            position: newPosition,
          };
        })
      );
    }
  }, [containerSize?.width, containerSize?.height, calculateNodePositions]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      if (handleClassClick) {
        handleClassClick(node.data.id);
      }
      if (handleMemberClick) {
        handleMemberClick(node.data.id);
      }
    },
    [handleClassClick, handleMemberClick]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultZoom={0.8}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};

export default OrganizationBody;
