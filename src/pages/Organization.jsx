import OrganizationHeader from "../components/specific/organization/OrganizationHeader";
import OrganizationBody from "../components/specific/organization/OrganizationBody";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { allClassFetch } from "../services/organization/organizationFetch";
import { ReactFlowProvider } from "reactflow";
import { calculateNodePositions } from "../util/organizationUtil";

import "reactflow/dist/style.css";

const Organization = () => {
  const navigate = useNavigate();
  const [containerSize, setContainerSize] = useState({
    width: 1200,
    height: 600,
  });
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const data = await allClassFetch();
        setClassData(data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClassData();
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth - 40;
      const height = 600;
      setContainerSize({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const positions = calculateNodePositions(
    containerSize.width,
    containerSize.height
  );

  const initialLevel1Nodes = [
    {
      id: "1",
      type: "organizationNode",
      position: positions.root,
      data: {
        id: 1,
        name: "현대오토에버 2기",
      },
    },
  ];

  const initialLevel2Nodes = classData.map((classData) => {
    return {
      id: `${classData.id + 10}`,
      type: "organizationNode",
      position: positions.level2[classData.id - 1],
      data: {
        id: classData.id,
        name: classData.name + " " + classData.cohort,
        classDesc: classData.classDesc,
        startDate: classData.startDate,
        endDate: classData.endDate,
      },
    };
  });

  const initialLevel3Nodes = classData.map((classData) => {
    return {
      id: `${classData.id + 20}`,
      type: "organizationNode",
      position: positions.level3[classData.id - 1],
      data: {
        id: classData.id,
        name: classData.instructor.name,
        role: "강사",
        profile_image: classData.instructor.profile_image,
        birth: classData.instructor.birth,
        gender: classData.instructor.gender,
        address: classData.instructor.address,
        is_active: classData.instructor.is_active,
      },
    };
  });

  const initialNodes = [
    ...initialLevel1Nodes,
    ...initialLevel2Nodes,
    ...initialLevel3Nodes,
  ];

  const initialEdgesLevel1 = classData.map((classItem) => {
    return {
      id: `1-${classItem.id + 10}`,
      source: "1",
      target: `${classItem.id + 10}`,
      type: "smoothstep",
      style: { stroke: "#10b981", strokeWidth: 2 },
    };
  });

  const initialEdgesLevel2 = classData.map((classItem) => {
    return {
      id: `${classItem.id + 10}-${classItem.id + 20}`,
      source: `${classItem.id + 10}`,
      target: `${classItem.id + 20}`,
      type: "smoothstep",
      style: { stroke: "#10b981", strokeWidth: 2 },
    };
  });

  const initialEdges = [...initialEdgesLevel1, ...initialEdgesLevel2];

  const handleClassClick = (classId) => {
    navigate(`/organization/${classId}`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <div className="flex justify-center items-center">
        <OrganizationHeader />
      </div>
      <div className="flex-1 flex justify-center items-center p-4">
        <ReactFlowProvider>
          <OrganizationBody
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            handleClassClick={handleClassClick}
            containerSize={containerSize}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Organization;
