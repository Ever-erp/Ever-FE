// 공지사항 대상 범위 타입
export type TargetRange =
  | "ALL_TARGETRANGE"
  | "WEB_APP"
  | "SMART_FACTORY"
  | "SW_EMBEDDED"
  | "IT_SECURITY"
  | "CLOUD";

// 공지사항 타입
export type NoticeType = "ALL_TYPE" | "NOTICE" | "SURVEY";

// 검색 타입
export type SearchType = "ALL_TYPE" | "TITLE" | "WRITER";

// 정렬 정보 타입
export interface SortInfo {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

// 페이지 정보 타입
export interface Pageable {
  offset: number;
  sort: SortInfo[];
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

// 공지사항 아이템 타입
export interface NoticeItem {
  id: number;
  title: string;
  writer: string;
  contents: string;
  targetRange: TargetRange;
  targetDate: string;
  registedAt: string;
  type: NoticeType;
  pinned: boolean;
}

// 공지사항 페이지 응답 타입
export interface NoticePageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: NoticeItem[];
  number: number;
  sort: SortInfo[];
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
  timestamp: string;
}

// 공지사항 생성/수정 요청 타입
export interface NoticeCreateRequest {
  title: string;
  contents: string;
  isPinned: boolean;
  targetRange: TargetRange;
  targetDate: string;
  type: NoticeType;
}

// 공지사항 수정 요청 타입 (PATCH)
export interface NoticeUpdateRequest {
  title: string;
  contents: string;
  isPinned: boolean;
  targetRange: TargetRange;
  targetDate: string;
  type: NoticeType;
}

// 공지사항 에디터 데이터 타입
export interface NoticeEditorData {
  title: string;
  contents: string;
  isPinned: boolean;
  targetRange: TargetRange;
  targetDate: string;
  type: NoticeType;
  files?: File[];
}

// 공지사항 초기 데이터 타입 (에디터용)
export interface NoticeInitialData {
  title?: string;
  contents?: string;
  isPinned?: boolean;
  targetRange?: TargetRange;
  targetDate?: string;
  type?: NoticeType;
  files?: File[];
  writer?: string;
  date?: string;
}

// 드롭다운 옵션 타입
export interface DropdownOption {
  value: string;
  label: string;
}

// 공지사항 설정 타입
export interface NoticeConfig {
  title: string;
  writeButtonText: string;
  writeRoute: string;
  detailRoute: string;
  showWriteButton: boolean;
  showDeleteButton: boolean;
  columns: Array<{
    key: string;
    label: string;
    width: string;
    align: string;
    render?: string;
    paddingLeft?: string;
  }>;
  dataKeyMapping: {
    id: string;
    type: string;
    title: string;
    writer: string;
    targetDate: string;
    registedAt: string;
  };
}
