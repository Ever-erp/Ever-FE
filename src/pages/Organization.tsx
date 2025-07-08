import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import OrganizationHeader from "../components/specific/organization/OrganizationHeader";
import OrganizationBody from "../components/specific/organization/OrganizationBody";
import { useNavigate } from "react-router-dom";
import {
  allClassFetch,
  ClassWithScheduleDto,
  Instructor,
} from "../services/organization/organizationFetch";
import { ReactFlowProvider } from "reactflow";
import {
  calculateNodePositions,
  CalculatedPositions,
} from "../util/organizationUtil";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Loading from "../components/common/Loading";
import "reactflow/dist/style.css";

// TypeScript 타입 정의
interface ContainerSize {
  width: number;
  height: number;
}

const Organization: React.FC = () => {
  const navigate = useNavigate();
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 1200,
    height: 600,
  });
  const [classData, setClassData] = useState<ClassWithScheduleDto[]>([]);
  const [instructorData, setInstructorData] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const { isAuthenticated } = useAuthFetch();

  const fetchClassData = async (): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      setLoading(true);
      const data = await allClassFetch(token);
      setClassData(data.classWithScheduleDtos);
      setInstructorData(data.instructors); // instructors로 변경
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
    const updateSize = (): void => {
      const width = window.innerWidth - 40;
      const height = 600;
      setContainerSize({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // positions를 useMemo로 감싸서 데이터가 있을 때만 계산하도록 수정
  const positions: CalculatedPositions = useMemo(() => {
    return calculateNodePositions(
      containerSize.width,
      containerSize.height,
      classData.length,
      instructorData.length
    );
  }, [
    containerSize.width,
    containerSize.height,
    classData.length,
    instructorData.length,
  ]);

  // 데이터가 로딩 중이거나 없을 때는 빈 배열 반환
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

  const initialLevel2Nodes =
    classData.length > 0
      ? classData.map((classItem, index) => {
          const classSchedules = classItem.schedules[0];
          return {
            id: `${classItem.classId + 10}`,
            type: "organizationNode",
            position: positions.level2[index] || { x: 0, y: 200 },
            data: {
              id: classItem.classId,
              name: classItem.name + " " + classItem.cohort + "기", // 숫자 타입이므로 "기" 추가
            },
          };
        })
      : [];

  const initialLevel3Nodes =
    instructorData.length > 0
      ? instructorData.map((instructor) => {
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
              email: instructor.email,
              phone: instructor.phone,
            },
          };
        })
      : [];

  const initialNodes = [
    ...initialLevel1Nodes,
    ...initialLevel2Nodes,
    ...initialLevel3Nodes,
  ];

  const initialEdgesLevel1 =
    classData.length > 0
      ? classData.map((classItem) => {
          return {
            id: `1-${classItem.classId + 10}`,
            source: "1",
            target: `${classItem.classId + 10}`,
            type: "smoothstep",
            style: { stroke: "#10b981", strokeWidth: 2 },
          };
        })
      : [];

  const initialEdgesLevel2 =
    instructorData.length > 0
      ? instructorData.map((instructor) => {
          return {
            id: `${instructor.classId + 10}-instructor-${instructor.classId}`,
            source: `${instructor.classId + 10}`,
            target: `instructor-${instructor.classId}`,
            type: "smoothstep",
            style: { stroke: "#10b981", strokeWidth: 2 },
          };
        })
      : [];

  const initialEdges = [...initialEdgesLevel1, ...initialEdgesLevel2];

  const handleClassClick = (classId: number | string): void => {
    navigate(`/organization/class/${classId}`);
  };

  const handleInstructorClick = (instructorClassId: number | string): void => {
    const instructor = instructorData.find(
      (inst) => inst.classId === instructorClassId
    );
    if (instructor) {
      setSelectedInstructor(instructor);
      setModalOpen(true);
    }
  };

  const handleModalClose = (): void => {
    setModalOpen(false);
    setSelectedInstructor(null);
  };

  const handleModalBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
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
              handleInstructorClick={handleInstructorClick}
              containerSize={containerSize}
              modalOpen={modalOpen}
            />
          </ReactFlowProvider>
        )}
      </div>

      {/* 모달을 Portal로 body에 직접 렌더링 */}
      {modalOpen &&
        selectedInstructor &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleModalBackdropClick}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-subBrand to-brand px-6 py-4 relative">
                <button
                  onClick={handleModalClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl font-bold"
                >
                  ×
                </button>
                <h2 className="text-white text-lg font-semibold">강사 정보</h2>
              </div>

              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                      {selectedInstructor.profileImage ? (
                        <img
                          src={selectedInstructor.profileImage}
                          alt={selectedInstructor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {selectedInstructor.name}
                      </h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {selectedInstructor.position}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 w-16">
                          이메일:
                        </span>
                        <span className="text-gray-800">
                          {selectedInstructor.email}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 w-16">
                          전화번호:
                        </span>
                        <span className="text-gray-800">
                          {selectedInstructor.phone}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 w-16">
                          생년월일:
                        </span>
                        <span className="text-gray-800">
                          {selectedInstructor.birth}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 w-16">
                          성별:
                        </span>
                        <span className="text-gray-800">
                          {selectedInstructor.gender}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-16">
                          주소:
                        </span>
                        <span className="text-gray-800">
                          {selectedInstructor.address
                            ? selectedInstructor.address
                            : "등록된 주소가 없습니다"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 카드 푸터 */}
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Organization;
