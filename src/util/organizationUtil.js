export const calculateGridPositions = (
  containerWidth,
  containerHeight,
  classMembers
) => {
  const maxRows = 3;
  const totalMembers = classMembers.length;
  const totalCols = Math.ceil(totalMembers / maxRows);

  const horizontalSpacing = 180;
  const verticalSpacing = 120;
  const classNodeWidth = 200;

  const classX = 150;
  const classY = containerHeight / 2;

  const gridStartX = classX + classNodeWidth + 100;
  const gridCenterY = containerHeight / 2;
  const gridStartY = gridCenterY - ((maxRows - 1) * verticalSpacing) / 2;

  const memberPositions = [];

  classMembers.forEach((member, index) => {
    const col = Math.floor(index / maxRows);
    const row = index % maxRows;

    memberPositions.push({
      x: gridStartX + col * horizontalSpacing,
      y: gridStartY + row * verticalSpacing,
    });
  });

  return {
    classPosition: { x: classX, y: classY },
    memberPositions,
    totalCols,
    maxRows,
  };
};

// 반응형 노드 위치 계산 함수
export const calculateNodePositions = (
  containerWidth,
  containerHeight,
  level2Count = 5,
  level3Count = 5
) => {
  const centerX = containerWidth / 2;
  const topY = 80;
  const middleY = 280;
  const bottomY = 480;

  const minSpacing = 180;
  const maxSpacing = 250;

  // 각 레벨의 간격 계산 (화면 크기에 따라 조정)
  const availableWidth = containerWidth - 300;
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

  // 레벨 2, 3 시작 X 위치 계산 (중앙 정렬)
  const level2StartX =
    level2Count > 1
      ? centerX - ((level2Count - 1) * level2Spacing) / 2
      : centerX;
  const level3StartX =
    level3Count > 1
      ? centerX - ((level3Count - 1) * level3Spacing) / 2
      : centerX;

  const level2Positions = [];
  const level3Positions = [];

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
