# :musical_score: 튜토리코더 - 원격 악기 교육 플랫폼

## :calendar: 프로젝트 진행 기간
2023.01.09(월) ~ 2023.02.17(금) (39일간 진행)
<br/>
SSAFY 8기 2학기 공통프로젝트 - 튜토리코더
<br/>
<br/>

## :computer: 서비스 화면

### 메인화면 / 닉네임 설정
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219237412-26d89183-d024-4c01-96fd-342653bf3e5d.gif width="350" height="200"> 
<img src=https://user-images.githubusercontent.com/91431779/219241558-97b92121-bc1d-44a6-bd13-ad8dfe51b197.gif width="350" height="200">
</p>

### 모드 설정 화면 / 혼자하기 모드 화면
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219242138-1e530030-045b-45be-ba4b-9a151d8e6405.png width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219243561-3e8659fa-493c-4231-aac9-9c095e7eb76f.png width="350" height="200">
</p>

### 혼자하기 튜토리얼 / 혼자하기 소리내기
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219243817-eac21e16-3c7f-416e-bccb-8d2889dff13f.gif width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219267777-d4aa8ada-7e35-42ab-b558-6651f9870256.gif width="350" height="200">
</p>

### 혼자하기 연주하기 / 같이하기 대기방
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219270991-b8aa3c95-8c96-4107-ac9c-2b7f5a1d6c3e.gif width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219365188-2d5ecaa0-ca87-48a8-902b-d0bdc280aec2.gif width="350" height="200">
</p>

### 같이하기 카카오톡 공유 / 같이하기 방 설정
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219365213-5c94f7f3-5ae1-4114-9d41-c8ec6af681a4.gif width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219367747-7c5ffa73-6fba-44c6-917b-11dd345aa6f1.gif width="350" height="200">
</p>

### 같이하기 소리내기 / 같이하기 연주하기
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219367778-28fc7002-0041-4265-9077-e080ac4071cb.gif width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219365246-4d07c5b7-69d7-4b27-942c-bc986602bdae.gif width="350" height="200">
</p>
<br/>
<br/>

# :musical_note: 기획 배경
음악적 성장이 가장 급속하게 발달하는 시기는 초등학교 시기이며 이 시기의 음악적 경험은 아이들에게 많은 영향을 미친다.
+ 높은 학업 성취도와 자존감
+ 창의적인 사고 
+ 의사를 표현하는 능력향상
하지만 현재 코로나로 인해 교실에서 마스크를 착용해야 하기 때문에 음악교육을 하는데 어려움이 있습니다.

이와 같은 어려움을 해소하기 위해서 탄생한 WebRTC기반의 원격 악기 교육 플랫폼 입니다
<br/>
<br/>

# :notes: 개요
### 원격 악기 교육 플랫폼 - 튜토리코더
+ 각자의 실력에 따른 연습 방법 제시

초등교육과정의 여러 동요들을 통해서 자신의 수준의 맞는 곡을 선택하여 연습할 수 있습니다.

+ 즉각적인 피드백

게임 결과를 분석한 결과를 보여줌으로써 자신의 부족한 부분을 바로 확인할 수 있습니다.
<br/>
<br/>

# :computer: 스토리보드
![스토리보드](https://user-images.githubusercontent.com/91431779/219376136-c2264198-8c00-4cb7-8e17-467d95f7dc5e.png)
<br/>
<br/>

# :books: 기술 스텍 및 주요 기능

## :movie_camera: OpenVidu
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219276627-bb848643-ad9e-4d56-a455-550ef5d29627.PNG width="550" height="200">
</p>

### OpenVidu는 웹 또는 모바일 애플리케이션에 실시간 커뮤니케이션을 쉽고 빠르게 추가할 수 있는 플랫폼입니다.
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219276397-292e389e-98bc-4eeb-b64d-ccd4d22b9401.gif width="350" height="200">
</p>
<br/>
<br/>

## :bust_in_silhouette: teachable machine

#### 리코더의 각 음계를 학습시켜 소리 인식을 통해 유저가 연주하는 음계를 파악하고 요구하는 음계와 맞는지 틀린지를 구분하게 하였습니다.
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219313753-cee19782-2ace-4167-9982-e71a25677db5.gif width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219312545-91f080bf-3033-4ba6-8e52-8cb729b08501.gif width="350" height="200">
</p>

#### 학습시킨 모델에서 솔과 라를 각각 연주한 결과입니다. 튜토리코더에서는 음계별로 도출된 값을 이용하여 어떤 음계에 가장 가까운지 판단하였습니다.


### 소리내기
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219412040-892580a2-aa93-4698-8362-1fedb6dfe58f.gif width="350" height="200">
</p>

+ 사용자가 내는 소리가 학습된 데이터중 어느 것에 가장 가까운지 판정
+ 도부터 시까지 7개 음계 외에도 배경소음, 음이탈 등의 틀린 경우 3가지를 추가로 학습시켜 정확도 향상
<br/>
<br/>

## 연주하기
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219360376-5c0037ce-b447-41ad-97b6-1ec77594b528.gif height="200">
</p>

### Canvas API

+ Canvas API를 이용하여 오선지 표시
+ 음 높이와 해당 음의 start / end 시간을 가진 Note라는 배열을 통해서 시간에 맞추어 화면에 표시

### UserMedia API

+ 사용자의 마이크 권한 요청

### Web Audio API 

+ AnalyserNode를 사용하여 실시간으로 마이크로 들어오는 주파수 값을 받는다.
+ 푸리에 변환 소스를 통해서 입력받은 주파수 값을 음 높이로 변환

### ResizeObserver API

+ 실시간으로 변환되는 음 높이를 받아서 큐 형태의 배열에 넣고 해당 배열을 화면 중앙에 표시
<br/>
<br/>

# :clipboard: 개발환경
## BackEnd
+ SpringBoot 2.5.5
+ Java 11

## FrontEnd
+ Vue.js 3.0.0
+ node 16.18.0

## AI
+ Teachable Machine
+ Tensorflow 1.3.1

## CI / CD
+ AWS EC2
+ Docker
+ NGINX
<br/>
<br/>

# :open_file_folder: 프로젝트 파일 구조
---
### Back
```
backend
  ├── src
  │   ├── auth
  │   ├── filter
  │   ├── interceptor
  │   └── listener
  ├── Dockerfile
  └── pom.xml
```
### Front
```
frontend
  ├── node_modules
  ├── patches
  │    ├── @tensorflow-models+speech-commands+0.4.2
  ├── public
  └── src
      ├── assets
      ├── components
      │   ├── multi
      │   │     ├── MultiAnalizeMain
      │   │     ├── MultiSoloAnalizeMain
      │   │     ├── MultiSongMain
      │   │     └── MultiSoundMain
      │   ├── solo
      │   │     ├── teachable
      │   │     ├── SoloAnalizeMain
      │   │     ├── SoloFingeringMain
      │   │     ├── SoloMain
      │   │       ├── SoloSongMain
      │   │       ├── SoloSoundMain
      │   │       ├── SoloTutorialMain
      │   │       └── SoloTutorialSelect
      │   ├── video
      │   │     ├── OvVideo
      │   │     ├── soloUserVideo
      │   │     └── UserVideo
      │   ├── HomeMain
      │   └── ModeMain
      ├── router
      ├── store
      └── views
          ├── solo
          │    ├── SoloAnalizeView
          │    ├── SoloFingeringView
          │    ├── SoloSongView
          │    ├── SoloSoundView
          │    ├── SoloTutorialSelectView
          │    ├── SoloTutorialView
          │    └── SoloView
          ├── HomeView
          ├── ModelView
          └── playroom
```
<br/>
<br/>

# :speech_balloon: 협업 툴
+ GitLab
+ Notion
+ JIRA
+ MatterMost
<br/>
<br/>

# :two_men_holding_hands: 협업 환경
## GitLab
### Git Flow
+ 각자 맡은 기능에 맞게 ``` feature ``` 브랜치를 생성하여 개발
+ 완료된 기능은 ``` develop ``` 에 ``` merge ``` 
+ 매일 오전 9시 스크럼 회의가 끝나면 ``` develop ``` 최신 버전을 ``` pull ```
> ### Commit convention
> ``` FEAT ``` : 기능 추가, 프로젝트 생성, 초기 설정 
<br> ``` FIX ``` : 기능 변경, 기능 수정, 오류 수정
<br> ``` REFACTOR ``` : 같은 기능을 하는 코드를 리팩토링

# [Git Convention](notion://www.notion.so/Git-Lab-2b8446ef0d594edc915db2a6068f901c)
## Notion
+ 팀 전체가 알아야 할 공지사항이나 프로젝트를 진행하면서 나오는 각종 산출물들의 형상관리
# [튜토리코더 Notion](https://roasted-pharaoh-ec9.notion.site/SSAFY-8-2-6060e4d19bbc4a90921adae525acb44d)

## JIRA
+ 협업 및 일정, 업무 관리를 JIRA를 통해 관리하였습니다.
+ 매 주 월요일 한 주동안 진행되어야 할 계획을 수립하여 진행할 이슈들을 스프린트를 만들어 등록

>``` Epic ``` : BackEnd, FrontEnd, 기획, 설계
<br> ``` story ``` : 기획, 설계, 산출물 제작 등 개발외의 업무에 관한 업무 관리
<br> ``` task ``` : 코드 작성과 관련된 개발업무에 관한 업무 관리

<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219372056-b1257d25-3a76-4020-9628-1a98ca425077.png height="300">
</p>

## MatterMost
+ 일일 스크럼 회의록 관리
+ GitLab과 연동하여 실시간 GitLab 관리
+ Archiving채널을 통해서 각 종 정보 공유
<br/>

# 산출물
+ [아키텍처 구성도](https://roasted-pharaoh-ec9.notion.site/81d5b85937e54b5fb691ff21fb1f0e2f)
+ [프로세스 다이어그램](https://roasted-pharaoh-ec9.notion.site/90f004abaa244a59bb24b217fbdc4315)
+ [컨벤션](https://roasted-pharaoh-ec9.notion.site/f69682cf770548638fe1c34992629cf6?v=4609e59e686d485491a43ccd319614e9)
+ [회의록](https://roasted-pharaoh-ec9.notion.site/59c3bf9df5c84eaf8f4c3f49432bba46?v=2309d6ea43754b46990150074993f36f)
<br/>
<br/>

# 결과물
+ [최종발표자료](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12C206/-/blob/main/ppt/%EA%B4%91%EC%A3%BC_2%EB%B0%98_C206_%EB%B0%9C%ED%91%9C%EC%9E%90%EB%A3%8C.pptx)
<br/>
<br/>

# 팀원 소개
![image](https://user-images.githubusercontent.com/91431779/219308515-293ac4a8-b0b8-4d6c-a1a3-d56faad0b826.png)
<br/>
<br/>



