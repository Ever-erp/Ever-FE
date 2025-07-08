import dogImage from "../../assets/images/dog.jpg";


enum Role {
  ROLE_강사 = "강사",
  ROLE_학생 = "학생",
  ROLE_관리자 = "관리자",
}

interface Schedule {
  id: number;
  subjectName: string;
  startDate: string;
  endDate: string;
  classDesc: string;
  classUrl: string;
}

interface ClassWithScheduleDto {
  classId: number;
  name: string;
  cohort: number;
  schedules: Schedule[];
}

interface Instructor {
  email: string;
  name: string;
  birth: string;
  gender: string;
  phone: string;
  address: string;
  profileImage: string | null;
  classId: number;
  position: string;
}

interface Member {
  email: string;
  name: string;
  birth: string;
  gender: string;
  phone: string;
  address: string;
  profileImage: string | null;
  classId: number;
  position: string;
}

interface SingleClassData {
  id: number;
  name: string;
  cohort: number;
  schedules: Schedule[];
  members: Member[];
}

interface ApiResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

// Role을 변환하는 유틸리티 함수
const convertRole = (position: string): string => {
  switch (position) {
    case "ROLE_강사":
      return Role.ROLE_강사;
    case "ROLE_학생":
      return Role.ROLE_학생;
    case "ROLE_관리자":
      return Role.ROLE_관리자;
    default:
      return position;
  }
};

/*
classWithScheduleDtos : [{
                classId : 1,
                name : "웹 / 앱",
                cohort : "2기",
                schedules: [            
                    id : 1,
                    subjectName : "웹 / 앱",
                    startDate : "2025-05-01",
                    endDate : "2025-10-31",
                    classDesc : "웹 / 앱 개발 클래스",
                    classUrl : "https://www.google.com"
                ]
}]

instructor : [{
                "email": "dwc071092@naver.com",
                "name": "오창은",
                "birth": "2025-06-23",
                "gender": "남성",
                "phone": "01012345678",
                "address": "",
                "profileImage": null,
                "classId": 5,
                "position": "강사"
}]
*/

const allClassFetch = async (
  token: string
): Promise<{
  classWithScheduleDtos: ClassWithScheduleDto[];
  instructors: Instructor[];
}> => {
  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const url = new URL(`${import.meta.env.VITE_ORGANIZATION_API_URL}/init`);

  const response = await fetch(url, requestInit);

  if (200 <= response.status && response.status < 300) {
    const responseJson: ApiResponse<{
      classWithScheduleDtos: ClassWithScheduleDto[];
      instructors: Instructor[];
    }> = await response.json();

    // instructors의 position을 변환
    const convertedData = {
      ...responseJson.data,
      instructors: responseJson.data.instructors.map((instructor) => ({
        ...instructor,
        position: convertRole(instructor.position),
      })),
    };

    return convertedData;
  } else {
    const errorResponse = await response.json();
    const errorStatus = errorResponse.status;
    const errorMessage = errorResponse.message;
    throw new Error(`${errorStatus} : ${errorMessage}`);
  }
};

const singleClassFetch = async (
  id: string | number,
  token: string
): Promise<SingleClassData> => {
  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const url = new URL(
    `${import.meta.env.VITE_ORGANIZATION_API_URL}/class/${id}`
  );

  const response = await fetch(url, requestInit);

  if (200 <= response.status && response.status < 300) {
    const responseJson: ApiResponse<SingleClassData> = await response.json();

    // members의 position을 변환
    const convertedData = {
      ...responseJson.data,
      members: responseJson.data.members.map((member) => ({
        ...member,
        position: convertRole(member.position),
      })),
    };

    return convertedData;
  } else {
    const errorResponse = await response.json();
    const errorStatus = errorResponse.status;
    const errorMessage = errorResponse.message;
    throw new Error(`${errorStatus} : ${errorMessage}`);
  }
};

export { allClassFetch, singleClassFetch, convertRole };
export { Role };
export type {
  ClassWithScheduleDto,
  Instructor,
  Schedule,
  Member,
  SingleClassData,
};
