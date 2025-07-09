// Organization API 응답 타입 정의

export interface Schedule {
  id: number;
  subjectName: string;
  startDate: string;
  endDate: string;
  classDesc: string;
  classUrl: string;
}

export interface ClassWithScheduleDto {
  classId: number;
  name: string;
  cohort: number;
  schedules: Schedule[];
}

export interface Instructor {
  email: string;
  name: string;
  birth: string;
  gender: string;
  phone: string;
  address: string;
  profileImage: string;
  classId: number;
  position: string;
}

export interface Member {
  email: string;
  name: string;
  birth: string;
  gender: string;
  phone: string;
  address: string;
  profileImage: string;
  classId: number;
  position: string;
}

export interface OrganizationInitResponse {
  message: string;
  status: number;
  data: {
    classWithScheduleDtos: ClassWithScheduleDto[];
    instructors: Instructor[];
  };
  timestamp: string;
}

export interface ClassDetailResponse {
  message: string;
  status: number;
  data: {
    id: number;
    name: string;
    cohort: number;
    schedules: Schedule[];
    members: Member[];
  };
  timestamp: string;
}

// React Flow 노드 데이터 타입
export interface NodeData {
  id: number | string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  birth?: string;
  gender?: string;
  address?: string;
  position?: string;
  classId?: number;
  is_active?: boolean;
}

// 컨테이너 크기 타입
export interface ContainerSize {
  width: number;
  height: number;
}

// 포지션 타입
export interface Position {
  x: number;
  y: number;
}
