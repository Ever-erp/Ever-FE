// Survey 관련 TypeScript 타입 정의

// 기본 API 응답 구조
export interface ApiResponse<T = any> {
  message: string;
  status: number;
  data: T;
  timestamp: string;
}

// Survey 생성 요청
export interface SurveyCreateRequest {
  surveyId: string;
  surveyTitle: string;
  surveyDesc: string;
  dueDate: string; // YYYY-MM-DD 형식
  status: string;
  surveySize: number;
  surveyQuestion: string[];
  surveyQuestionMeta: string[][];
  className: string;
}

// Survey 수정 요청
export interface SurveyUpdateRequest {
  surveyTitle: string;
  surveyDesc: string;
  dueDate: string; // YYYY-MM-DD 형식
  status: string;
  surveySize: number;
  surveyQuestion: string[];
  surveyQuestionMeta: string[][];
  className: string;
}

// Survey 답변 제출/수정 요청
export interface SurveyAnswerRequest {
  answerList: string[];
}

// Survey 복수 삭제 요청
export interface SurveyMultipleDeleteRequest {
  surveyIds: string[];
}

// Survey 기본 정보
export interface SurveyItem {
  surveyId: string;
  surveyTitle: string;
  surveyDesc: string;
  status: string;
  createdAt: string; // YYYY-MM-DD 형식
  dueDate: string; // YYYY-MM-DD 형식
  surveySize: number;
  surveyQuestion: string[];
  surveyQuestionMeta: string[][];
  className: string;
  answeredCount: number;
  classTotalMemberCount: number;
  surveyAnswer: string[];
}

// Member 정보
export interface SurveyMember {
  memberId: number;
  memberName: string;
  answer: string[];
}

// 답변하지 않은 Member 정보
export interface NotAnsweredMember {
  memberId: number;
  memberName: string;
}

// Survey 상세 조회 응답 (관리자용)
export interface SurveyDetailResponse {
  survey: SurveyItem;
}

// Survey 사용자 조회 응답
export interface SurveyUserResponse {
  survey: SurveyItem;
  member: SurveyMember;
}

// Survey 멤버들 조회 응답 (관리자용)
export interface SurveyMembersResponse {
  survey: SurveyItem;
  members: SurveyMember[];
  notAnsweredMembers: NotAnsweredMember[];
}

// 페이징 관련 타입
export interface SortInfo {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableInfo {
  offset: number;
  sort: SortInfo[];
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

// Survey 페이지 응답
export interface SurveyPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: SurveyItem[];
  number: number;
  sort: SortInfo[];
  pageable: PageableInfo;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 프론트엔드에서 사용하는 Survey 데이터 (responseRate 추가)
export interface SurveyItemWithRate extends SurveyItem {
  responseRate: string; // "50% (10/20)" 형식
}

// Survey 작성용 Question 타입
export interface SurveyQuestion {
  id: number;
  type: "객관식" | "주관식";
  question: string;
  options: string[];
}

// Survey 작성용 데이터
export interface SurveyWriteData {
  title: string;
  description: string;
  endDate: string;
  className: string;
  questions: SurveyQuestion[];
}

// Survey 상태 타입
export type SurveyStatus = "작성중" | "진행중" | "완료";

// 클래스 이름 타입
export type ClassName =
  | "웹앱"
  | "임베디드"
  | "IT보안"
  | "스마트팩토리"
  | "클라우드";

// 관리자 Survey 클릭 모드
export type AdminSurveyMode = "survey" | "response";
