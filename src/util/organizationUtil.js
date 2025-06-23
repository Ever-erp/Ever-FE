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
export const calculateNodePositions = (containerWidth, containerHeight) => {
  const centerX = containerWidth / 2;
  const topY = 80;
  const middleY = 280;
  const bottomY = 480;

  // 각 레벨의 노드 개수
  const level2Count = 5; // 레벨2 - 클래스
  const level3Count = 5; // 레벨3 - 강사

  const minSpacing = 180;
  const maxSpacing = 250;

  // 각 레벨의 간격 계산 (화면 크기에 따라 조정)
  const availableWidth = containerWidth - 300;
  const level2Spacing = Math.max(
    minSpacing,
    Math.min(maxSpacing, availableWidth / (level2Count - 1))
  );
  const level3Spacing = Math.max(
    minSpacing,
    Math.min(maxSpacing, availableWidth / (level3Count - 1))
  );

  // 레벨 2, 3 시작 X 위치 계산 (중앙 정렬)
  const level2StartX = centerX - ((level2Count - 1) * level2Spacing) / 2;
  const level3StartX = centerX - ((level3Count - 1) * level3Spacing) / 2;

  return {
    root: { x: centerX, y: topY },

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
