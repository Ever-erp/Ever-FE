import React from "react";
import { useParams } from "react-router-dom";
import { singleClassFetch } from "../services/organization/organizationFetch";
import { useState, useEffect } from "react";
import OrganizationHeader from "../components/specific/organization/OrganizationHeader";
import OrganizationBody from "../components/specific/organization/OrganizationBody";
import { ReactFlowProvider } from "reactflow";
import { calculateGridPositions } from "../util/organizationUtil";
import Loading from "../components/common/Loading";

const OrganizationClass = () => {
  const { classId } = useParams();
  const [containerSize, setContainerSize] = useState({
    width: 1200,
    height: 600,
  });

  const [classTitle, setClassTitle] = useState("");
  //   const [classDescription, setClassDescription] = useState("");
  //   const [setStartDate, setSetStartDate] = useState("");
  //   const [setEndDate, setSetEndDate] = useState("");
  const [classMembers, setClassMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const data = await singleClassFetch(classId, token);
        setClassTitle(data.name + " " + data.cohort);
        // setClassDescription(data.schedules[0].classDesc);
        // setSetStartDate(data.schedules[0].startDate);
        // setSetEndDate(data.schedules[0].endDate);
        setClassMembers(data.members);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [classId]);

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

  const positions = calculateGridPositions(
    containerSize.width,
    containerSize.height,
    classMembers
  );

  const classNode = {
    id: "class-1",
    type: "organizationNodeHorizontal",
    position: positions.classPosition,
    data: {
      id: 1,
      name: classTitle,
    },
  };

  const memberNodes = classMembers.map((member, index) => ({
    id: `member-${member.email}`,
    type: "organizationNodeHorizontal",
    position: positions.memberPositions[index] || {
      x: 600 + index * 200,
      y: 300,
    },
    data: {
      id: member.email,
      name: member.name,
      email: member.email,
      phone: member.phone,
      profile_image: member.profileImage,
      birth: member.birth,
      gender: member.gender,
      address: member.address,
      position: member.position,
      classId: member.classId,
      is_active: true,
    },
  }));

  const initialNodes = [classNode, ...memberNodes];

  const createEdges = () => {
    const edges = [];
    const maxRows = 3;
    const totalMembers = classMembers.length;
    const totalCols = Math.ceil(totalMembers / maxRows);

    const firstColMembers = Math.min(maxRows, totalMembers);
    for (let i = 0; i < firstColMembers; i++) {
      const member = classMembers[i];
      edges.push({
        id: `class-1-member-${member.email}`,
        source: "class-1",
        target: `member-${member.email}`,
        sourceHandle: "right",
        targetHandle: "left",
        type: "smoothstep",
        style: { stroke: "#10b981", strokeWidth: 2 },
      });
    }

    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < totalCols - 1; col++) {
        const currentIndex = col * maxRows + row;
        const nextIndex = (col + 1) * maxRows + row;

        if (currentIndex < totalMembers && nextIndex < totalMembers) {
          const currentMember = classMembers[currentIndex];
          const nextMember = classMembers[nextIndex];

          edges.push({
            id: `member-${currentMember.email}-member-${nextMember.email}`,
            source: `member-${currentMember.email}`,
            target: `member-${nextMember.email}`,
            sourceHandle: "right",
            targetHandle: "left",
            type: "smoothstep",
            style: { stroke: "#10b981", strokeWidth: 2 },
          });
        }
      }
    }
    return edges;
  };

  const initialEdges = createEdges();

  const findMemberById = (memberEmail) => {
    return classMembers.find((member) => member.email === memberEmail);
  };

  const handleMemberClick = (memberEmail) => {
    setSelectedMember(findMemberById(memberEmail));
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      {modalOpen === true ? (
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
              <h2 className="text-white text-lg font-semibold">멤버 정보</h2>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                    {selectedMember?.profileImage ? (
                      <img
                        src={selectedMember.profileImage}
                        alt={selectedMember.name}
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
                      {selectedMember?.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 w-16">
                        이메일:
                      </span>
                      <span className="text-gray-800">
                        {selectedMember?.email}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 w-16">
                        전화번호:
                      </span>
                      <span className="text-gray-800">
                        {selectedMember?.phone}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 w-16">
                        생년월일:
                      </span>
                      <span className="text-gray-800">
                        {selectedMember?.birth}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 w-16">
                        성별:
                      </span>
                      <span className="text-gray-800">
                        {selectedMember?.gender}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-16">
                        주소:
                      </span>
                      <span className="text-gray-800">
                        {selectedMember?.address
                          ? selectedMember?.address
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
        </div>
      ) : null}
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
              handleMemberClick={handleMemberClick}
              containerSize={containerSize}
            />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
};

export default OrganizationClass;
