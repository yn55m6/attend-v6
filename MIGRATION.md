# 🚀 React 마이그레이션 가이드 (Migration Guide)

## 1. 프로젝트 개요
- **목표:** `attend_v5` (Vanilla JS + HTML) → `attend-v6` (React + TypeScript + Vite) 전환.
- **핵심 가치:** 유지보수성 향상, 타입 안정성 확보, 컴포넌트 기반 아키텍처 도입.
- **기존 로직 유지:** Firebase Firestore 데이터 구조 및 QR 코드 생성/스캔 로직은 100% 호환되도록 유지.

## 2. 기술 스택 (Tech Stack)
| 구분 | 기술 | 비고 |
|---|---|---|
| **Framework** | React 18 | Functional Components, Hooks |
| **Language** | TypeScript | Strict Mode 적용 |
| **Build Tool** | Vite | 빠른 개발 서버 및 빌드 |
| **Styling** | Tailwind CSS | 기존 클래스 재사용 용이 |
| **Backend** | Firebase v9 | Firestore, Analytics (Modular SDK 사용) |
| **Routing** | React Router v6 | SPA 라우팅 |
| **State** | Context API | 전역 상태 (Auth, Data) 관리 |
| **Icons** | Lucide React | FontAwesome 대체 (더 가벼움) 또는 유지 |
| **Chart** | Chart.js + react-chartjs-2 | 리포트 그래프 구현 |

## 3. 폴더 구조 (Directory Structure)
```text
src/
├── assets/             # 정적 파일
├── components/         # UI 컴포넌트
│   ├── common/         # Button, Modal, Input, Card 등
│   ├── layout/         # Header, BottomNav, LayoutWrapper
│   ├── members/        # MemberList, AddMemberForm
│   └── reports/        # TrendChart, WeeklyTable
├── contexts/           # AuthContext, DataContext(Members, Logs)
├── hooks/              # useFirestore, useAuth, useSound
├── pages/              # Home, Members, Reports, Login, QRScan
├── services/           # firebase.ts (설정 및 API 래퍼)
├── utils/              # dateUtils, sessionUtils (상수 및 헬퍼)
├── App.tsx             # 라우팅 설정
└── main.tsx            # 진입점
```

## 4. 마이그레이션 단계 (Phases)

### Phase 1: 프로젝트 셋업 (Setup)
- [x] 1. Vite 프로젝트 생성: `npm create vite@latest attend-v6 -- --template react-ts`
- [x] 2. Tailwind CSS 설치 및 설정.
- [x] 3. Firebase SDK 설치 및 `src/services/firebase.ts` 설정 (환경변수 `.env` 사용).
- [x] 4. 필요한 라이브러리 설치 (`react-router-dom`, `chart.js`, `react-chartjs-2`, `qrcode.react`, `lucide-react`).

### Phase 2: 유틸리티 및 상수 이관
- [x] 1. `SESSIONS`, `DAYS`, `TIMES` 상수 배열을 `src/utils/constants.ts`로 이동.
- [x] 2. `getWeekOfMonth` 등 헬퍼 함수를 `src/utils/dateUtils.ts`로 이동.

### Phase 3: 컴포넌트 분리 및 구현
- [x] 1. **Layout:** `Header` (로고, 설정), `BottomNav` (탭 네비게이션) 컴포넌트 구현.
 [x] 2. **Auth:**
    - [x] 관리자 로그인 페이지 및 `AuthContext` 구현 (비밀번호 변경 기능 포함).
 [x] 3. **Members:**
    - [x] `useMembers` 훅 생성 (Firestore 실시간 동기화).
    - [x] 회원 목록 조회, 검색, 등록, 삭제(보호 로직) 구현.
    - [x] 회원별 상세 출석 이력 모달 구현.
 [x] 4. **Attendance (출석):**
    - [x] QR 스캔 페이지: URL 파라미터(`?session=...`) 파싱 및 유효성 검사.
    - [x] 출석 체크 모달: 회원 선택/직접 입력 및 중복 방지 로직.
    - [x] 효과음 재생 (`useSound` - 딩동/땡) 구현.
 [x] 5. **Admin (관리 도구):**
    - [x] QR 코드 생성 및 인쇄 미리보기 모달 (요일/차수별 고정).
    - [x] 종이 명부 텍스트 일괄 입력 (Bulk Insert) UI 및 로직.
    - [x] 데이터 초기화 기능 (안전 장치 포함).
 [x] 6. **Reports:**
    - [x] Chart.js 컴포넌트화 (월별 추이).
    - [x] 주차별/반별 통계 테이블 및 랭킹 뷰 구현.

### Phase 4: 기능 검증 및 배포
 [x] 1. 기존 v5 데이터와 연동 테스트 (App.tsx 라우팅 및 Context 연동 완료).
 [x] 2. 빌드 오류 수정 및 파일 구조 최적화.
- [ ] 3. Vercel 또는 Firebase Hosting 배포.
- [ ] 4. README.md 업데이트 (프로젝트 설명, 설치 방법, 기술 스택 등).

## 5. 주요 변경 사항 (Refactoring Points)

| 기존 (v5) | 변경 (v6) |
|---|---|
| `window.members` 전역 변수 | `useContext(DataContext)` 또는 Custom Hook |
| `document.getElementById` | `useRef` 또는 React State (`useState`) |
| `onclick="func()"` | `onClick={handleFunc}` |
| `innerHTML` 문자열 조합 | JSX 렌더링 (`map` 함수 활용) |
| `alert()`, `confirm()` | Toast UI 또는 커스텀 모달 (권장) |
| `playSound()` | `useSound` 훅 또는 `Audio` 객체 래퍼 |

## 6. 환경 변수 설정 (.env)
보안을 위해 Firebase 설정값은 `.env` 파일로 관리합니다.

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
...
```