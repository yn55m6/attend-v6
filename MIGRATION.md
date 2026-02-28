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
1.  Vite 프로젝트 생성: `npm create vite@latest attend-v6 -- --template react-ts`
2.  Tailwind CSS 설치 및 설정.
3.  Firebase SDK 설치 및 `src/services/firebase.ts` 설정 (환경변수 `.env` 사용).
4.  필요한 라이브러리 설치 (`react-router-dom`, `chart.js`, `react-chartjs-2`, `qrcode.react`).

### Phase 2: 유틸리티 및 상수 이관
1.  `SESSIONS`, `DAYS`, `TIMES` 상수 배열을 `src/utils/constants.ts`로 이동.
2.  `getWeekOfMonth` 등 헬퍼 함수를 `src/utils/dateUtils.ts`로 이동.

### Phase 3: 컴포넌트 분리 및 구현
1.  **Layout:** `Header`, `BottomNav` 컴포넌트 구현.
2.  **Auth:** 관리자 로그인 로직을 `AuthContext`로 구현 (localStorage 연동).
3.  **Members:** `useMembers` 훅을 생성하여 Firestore 실시간 동기화(`onSnapshot`) 구현.
4.  **Attendance:**
    - QR 스캔 로직: URL 파라미터 파싱 로직을 `useEffect`로 처리.
    - 출석 체크 모달: 별도 컴포넌트로 분리 (`AttendanceModal`).
    - 종이 명부 입력: 텍스트 파싱 로직을 `utils`로 분리하고 UI 구현.
5.  **Reports:** Chart.js 컴포넌트화 및 데이터 가공 로직 분리.

### Phase 4: 기능 검증 및 배포
1.  기존 v5 데이터와 연동 테스트 (Firestore 컬렉션 `members`, `logs` 공유).
2.  모바일 반응형 UI 테스트.
3.  Vercel 또는 Firebase Hosting 배포.

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