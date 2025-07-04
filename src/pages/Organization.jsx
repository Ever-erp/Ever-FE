import React, { useState, useEffect } from "react";
import OrganizationHeader from "../components/specific/organization/OrganizationHeader";
import OrganizationBody from "../components/specific/organization/OrganizationBody";
import { useNavigate } from "react-router-dom";
import { allClassFetch } from "../services/organization/organizationFetch";
import { ReactFlowProvider } from "reactflow";
import { calculateNodePositions } from "../util/organizationUtil";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import "reactflow/dist/style.css";

const Organization = () => {
  const navigate = useNavigate();
  const [containerSize, setContainerSize] = useState({
    width: 1200,
    height: 600,
  });
  const [classData, setClassData] = useState([]);
  const [instructorData, setInstructorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthFetch();

  const fetchClassData = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      const data = await allClassFetch(token);
      setClassData(data.classWithScheduleDtos);
      setInstructorData(data.instructors);
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    containerSize.height,
    classData.length,
    instructorData.length
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

  const initialLevel2Nodes = classData.map((classItem, index) => {
    const classSchedules = classItem.schedules[0];
    return {
      id: `${classItem.classId + 10}`,
      type: "organizationNode",
      position: positions.level2[index] || { x: 0, y: 200 },
      data: {
        id: classItem.classId,
        name: classItem.name + " " + classItem.cohort,
      },
    };
  });

  const initialLevel3Nodes = instructorData.map((instructor) => {
    const classIndex = classData.findIndex(
      (cls) => cls.classId === instructor.classId
    );
    return {
      id: `instructor-${instructor.classId}`,
      type: "organizationNode",
      position: positions.level3[classIndex] || { x: 0, y: 350 },
      data: {
        id: instructor.classId,
        name: instructor.name,
        role: instructor.position,
        profile_image: instructor.profileImage,
        birth: instructor.birth,
        gender: instructor.gender,
        address: instructor.address,
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
      id: `1-${classItem.classId + 10}`,
      source: "1",
      target: `${classItem.classId + 10}`,
      type: "smoothstep",
      style: { stroke: "#10b981", strokeWidth: 2 },
    };
  });

  const initialEdgesLevel2 = instructorData.map((instructor) => {
    return {
      id: `${instructor.classId + 10}-instructor-${instructor.classId}`,
      source: `${instructor.classId + 10}`,
      target: `instructor-${instructor.classId}`,
      type: "smoothstep",
      style: { stroke: "#10b981", strokeWidth: 2 },
    };
  });

  const initialEdges = [...initialEdgesLevel1, ...initialEdgesLevel2];

  const handleClassClick = (classId) => {
    navigate(`/organization/class/${classId}`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <div className="flex justify-center items-center">
        <OrganizationHeader />
      </div>
      <div className="flex-1 flex justify-center items-center p-4">
        {loading ? (
          <Loading text="데이터를 불러오고 있습니다..." />
        ) : (
          <ReactFlowProvider>
            <OrganizationBody
              initialNodes={initialNodes}
              initialEdges={initialEdges}
              handleClassClick={handleClassClick}
              containerSize={containerSize}
            />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
};

export default Organization;
