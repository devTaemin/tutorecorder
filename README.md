# 웹/모바일(웹 기술) 스켈레톤 프로젝트

<!-- 필수 항목 -->

## 카테고리

| Application | Domain | Language | Framework |
| ---- | ---- | ---- | ---- |
| :white_check_mark: Desktop Web | :black_square_button: AI | :white_check_mark: JavaScript | :white_check_mark: Vue.js |
| :white_check_mark: Mobile Web | :black_square_button: Big Data | :black_square_button: TypeScript | :black_square_button: React |
| :white_check_mark: Responsive Web | :black_square_button: Blockchain | :black_square_button: C/C++ | :black_square_button: Angular |
| :black_square_button: Android App | :black_square_button: IoT | :black_square_button: C# | :black_square_button: Node.js |
| :black_square_button: iOS App | :black_square_button: AR/VR/Metaverse | :white_check_mark: Python | :white_check_mark: Flask/Django |
| :black_square_button: Desktop App | :black_square_button: Game | :white_check_mark: Java | :white_check_mark: Spring/Springboot |
| | | :black_square_button: Kotlin | |

<!-- 필수 항목 -->

## 프로젝트 소개

* 프로젝트명: 그룹 비디오 컨퍼런스 서비스
* 서비스 특징: 웹/모바일(웹 기술) 프로젝트를 위한 스켈레톤 프로젝트
* 주요 기능
  - 회원 관리
  - 화상 미팅룸
  - 그룹 채팅
* 주요 기술
  - WebRTC
  - WebSocket
  - JWT Authentication
  - REST API
* 참조 리소스
  * Vuetify: 디자인 전반 적용
  * Vue Argon Design System: 디자인 전반 적용
  * Vue Black Dashboard Pro(유료): 캘린더 컴포넌트 사용
  * AR Core: 구글에서 제공하는 AR 지원 라이브러리. 이미지 인식 및 오버레이 영상에 활용
  * Color Thief: 이미지 색상 추출 라이브러리. 커버 사진 색상 추출 및 배경 변경에 활용
  * Animation.css: CSS 애니메이션 지원 라이브러리. 메인 페이지 진입 애니메이션에 활용
* 배포 환경
  - URL: // 웹 서비스, 랜딩 페이지, 프로젝트 소개 등의 배포 URL 기입
  - 테스트 계정: // 로그인이 필요한 경우, 사용 가능한 테스트 계정(ID/PW) 기입

<!-- 자유 양식 -->

## 팀 소개
* 김현서: QA, 프론트엔드 개발
* 노준호: 컨벤션 관리, 기획, 프론트엔드 개발
* 오성훈: UI/UX, 프론트엔드 개발
* 이우승: 팀장, 백엔드 개발
* 임태민: PM, 백엔드 개발
* 최종욱: CI/CD, 백엔드 개발

<!-- 자유 양식 -->

## 프로젝트 상세 설명

// 개발 환경, 기술 스택, 시스템 구성도, ERD, 기능 상세 설명 등

## 프로젝트 요구 사항

### 📌 프론트엔드 요구 사항
| 분류           |  대분류     |   요구사항 명           |     구현 여부       |
| :----------------: | :----------------: | :----------------:  | :----------------: |
| 공통 |   로그인 및 토큰 발급 시 | localStorage 저장 관리 | ☑️ |
| |  페이지 진입 시 토큰 존재하는 경우 |  토큰을 이용하여 유저의 정보를 받아오기 | ☑️ |
| |  페이지 진입 시 토큰 존재하는 경우 |  로그인 화면을 표시 | ☑️ |
| | 페이지 진입 시 토큰이 존재하지 않는 경우 | 비로그인 화면을 표시 | ☑️ |
| | 페이지 진입 시 토큰이 존재하지 않는 경우 | 비로그인 화면을 표시 | ☑️ |
| | 공용 Axios 처리 토큰이 존재할 경우 | Bearer 토큰 값 헤더 전송 | ☑️ |
| | 공용 Axios 처리 에러처리 | 응답코드 401 error 메세지 | ☑️ |
| | 공용 Axios 처리 에러처리 | 응답코드 403 error 메세지 | ☑️ |
| | 로그아웃 처리 | localStorage 토큰 삭제 | ☑️ |
| | 로그아웃 처리 | 홈 메뉴 페이지 리프레시 | ☑️ |
| | 로딩 스피너 |  | ☑️ |
| | 입력 필드 유효성 체크 |  | ☑️ |
| 네비게이션 | 비로그인  | 네비게이션 구성 | ☑️ |
|  | 비로그인  | 회원가입 구성 | ☑️ |
|  | 비로그인  | 로그인 구성 | ☑️ |
|  | 로그인  | 네비게이션 구성 | ☑️ |


### 📌 백엔드 요구 사항
| 분류           |  대분류     |   요구사항 명           |     구현 여부       |
| :----------------: | :----------------: | :----------------:  | :----------------: |
| 데이터베이스 | 초기 실행 시 | Database SQL 스크립트 수행 | ☑️ |
| | JPA | 각 테이블의 Entity 구현 | ☑️ |
| | JPA | 각 테이블의 Repository, RepositorySupport 구현 | ☑️ |
| API | 인증 | 에러 처리 | ☑️ |
| | 유저 | 회원가입 API  | ☑️ |
| | 유저 | 내 프로필 API  | ☑️ |
| | 유저 | 유저 정보 API  | ☑️ |
| | 유저 | 유저 정보 수정 API  | ☑️ |
| | 유저 | 유저 정보 삭제 API  | ☑️ |
.

### 📌 ERD

![SubPJT1ERD](https://user-images.githubusercontent.com/91431779/212225285-009d9fef-086e-444e-a70d-bdb9400766d1.png)
