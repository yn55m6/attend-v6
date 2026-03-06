# 💻 출석부 시스템 매뉴얼

## 1. 시스템 개요

-   **프로젝트명:** 몸펴기생활운동 연신내 출석부 (v6)
-   **목표:** 서버리스, 오프라인 우선(Offline-First)으로 동작하는 PWA 기반 출석 관리 시스템.
-   **핵심 아키텍처:**
    -   **프론트엔드:** Vanilla JS, HTML, Tailwind CSS (CDN)
    -   **데이터베이스:** IndexedDB (로컬)와 Firebase Firestore (클라우드)를 함께 사용하는 하이브리드 모델.
    -   **PWA:** Service Worker (`sw.js`)를 통해 오프라인 캐싱 및 앱 설치 기능 제공.
    -   **배포:** Vercel을 통한 정적 사이트 배포.

## 2. 파일 구조

-   `index.html`: 앱의 모든 UI, 로직, 스타일을 포함하는 단일 파일.
-   `sw.js`: PWA의 핵심인 서비스 워커 파일. 캐싱 전략과 업데이트 로직을 담당.
-   `manifest.json`: 웹 앱 매니페스트. 앱 이름, 아이콘, 테마 색상 등 PWA 설치 정보를 정의.
-   `vercel.json`: Vercel 배포 설정 파일. 정적 사이트로 배포하도록 지정.
-   `README.md`: 프로젝트 개요 및 최신 변경사항.
-   `MIGRATION.md`: React 버전으로의 마이그레이션 계획서.

## 3. 핵심 로직 (`index.html`)

### 3.1. 초기화 (`window.onload`)

1.  **테마 적용:** `localStorage`에 저장된 테마를 우선 적용.
2.  **IndexedDB 초기화:** `dbHelper.initDB()`를 호출하여 'members', 'logs', 'instructors' Object Store를 준비.
3.  **데이터 로딩:**
    -   **온라인:** Firebase에서 모든 데이터를 가져와 IndexedDB를 덮어쓴다 (`manualSyncWithFirebase`와 유사). 이후 오프라인 상태에서 쌓인 'pending' 데이터를 서버로 전송(`syncPendingData`).
    -   **오프라인:** IndexedDB에서만 데이터를 로드.
4.  **전역 상태 주입:** 로드된 데이터를 `window.members`, `window.logs`, `window.instructors`에 할당.
5.  **화면 분기:**
    -   URL에 `?session=` 파라미터가 있으면 QR 스캔으로 간주, 회원 출석 모드로 진입.
    -   `sessionStorage`에 로그인 정보가 있으면 해당 모드(`admin` 또는 `member`)로 진입.
    -   아무 정보도 없으면 초기 모드 선택 화면(`showLoginScreen`) 표시.

### 3.2. 데이터 관리 및 동기화

-   **`dbHelper`:** IndexedDB를 Promise 기반으로 쉽게 사용하기 위한 래퍼 객체. `getAll`, `put`, `bulkPut` 등의 메서드 제공.
-   **`firebaseHelper`:** Firebase Firestore와 상호작용하기 위한 래퍼 객체. `getCollection`, `batchWrite` 등의 메서드 제공.
-   **동기화 모델 (비용 최적화):**
    -   **읽기(Read):** 실시간 리스너(`onSnapshot`)를 사용하지 않음. 앱 시작 시 또는 '수동 동기화' 버튼 클릭 시에만 서버에서 데이터를 가져온다.
    -   **쓰기(Write):**
        -   **온라인:** Firebase와 IndexedDB에 동시에 쓴다.
        -   **오프라인:** IndexedDB에만 `syncStatus: 'pending'` 플래그와 함께 쓴다.
-   **`syncPendingData()`:** 'online' 이벤트 발생 시 또는 수동 동기화 후 호출. `syncStatus: 'pending'` 상태인 모든 로컬 데이터를 찾아 Firebase에 일괄 업로드하고 플래그를 제거.
-   **`manualSyncWithFirebase()`:** 서버 데이터를 기준으로 로컬 DB를 완전히 덮어쓰는 가장 강력한 동기화.

### 3.3. UI 렌더링

-   **페이지 전환:** `switchPage(element, pageId)` 함수가 담당. `display: none/block` 스타일을 직접 제어하여 페이지를 전환하고, 하단 네비게이션의 활성 상태를 변경.
-   **동적 렌더링:** `renderMembers()`, `showReports()` 등의 함수가 `window.members`, `window.logs` 전역 변수를 기반으로 `innerHTML`을 사용하여 UI를 동적으로 생성.
-   **상태 관리:** 별도의 상태 관리 라이브러리 없이, 전역 변수와 DOM을 직접 조작하는 방식으로 구현.

## 4. PWA 및 캐싱 전략 (`sw.js`)

-   **캐시 버전:** `CACHE_NAME` 상수에 버전을 명시. 이 값을 변경하면 서비스 워커가 업데이트되면서 이전 캐시를 모두 삭제하고 새로 캐싱.
-   **캐싱 전략:**
    -   **`navigate` 요청 (HTML 페이지):** **네트워크 우선(Network First)**. `fetch(event.request)`를 통해 항상 최신 `index.html`을 가져온다. 이는 코드 업데이트 시 캐시 문제로 옛날 버전이 보이는 것을 원천 차단하기 위함. 이 전략 때문에 오프라인에서 앱 최초 실행은 불가능.
    -   **기타 요청 (CSS, JS, 이미지 등):** **캐시 우선(Cache First)**. `caches.match()`로 캐시를 먼저 확인하고, 없으면 네트워크에서 가져와 캐시에 저장 후 반환.
-   **업데이트 프로세스:**
    1.  `sw.js` 파일이 변경되면 브라우저는 새 서비스 워커를 `install` 한다.
    2.  `install` 이벤트에서 `self.skipWaiting()`이 호출되어, 새 서비스 워커는 즉시 활성화 대기 상태를 건너뛴다.
    3.  `activate` 이벤트에서 새 `CACHE_NAME`을 제외한 모든 옛날 캐시를 삭제하고, `self.clients.claim()`으로 현재 열린 모든 페이지의 제어권을 즉시 가져온다.
    4.  `index.html`에서는 `controllerchange` 이벤트를 감지하여 `window.location.reload()`를 실행, 사용자가 최신 버전의 앱을 보도록 강제 새로고침한다.

## 5. 배포 (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "*",
      "use": "@vercel/static"
    }
  ]
}
```

-   `"use": "@vercel/static"`: 이 프로젝트는 별도의 빌드 과정이 필요 없는 정적 파일들로 구성되어 있음을 Vercel에 명시. Vercel은 `npm run build` 같은 명령 없이, 프로젝트 루트의 모든 파일을 그대로 배포한다.

## 6. 유지보수 가이드

-   **기능 추가/수정:** `index.html` 파일의 `<script>` 태그 내에서 로직을 수정.
-   **UI 변경:** `index.html`의 HTML 구조나 Tailwind CSS 클래스를 수정.
-   **앱 업데이트 배포:**
    1.  코드 수정 후, **반드시 `sw.js` 파일의 `CACHE_NAME` 버전 숫자를 올린다.** (예: `v68` -> `v69`)
    2.  `git push`를 통해 변경사항을 배포한다.
    3.  사용자가 앱에 재접속하면 서비스 워커가 업데이트되고, 잠시 후 자동으로 새로고침되어 업데이트가 적용된다.
-   **Firebase 비용 관리:** Firebase 콘솔의 'Usage' 탭을 주기적으로 확인. 비용 절약을 위해 `onSnapshot`과 같은 실시간 리스너는 가급적 사용하지 않는다.