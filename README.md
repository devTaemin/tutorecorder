# :notes: 튜토리코더 - 원격 악기 교육 플랫폼

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

### 혼자하기 연주하기
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219270991-b8aa3c95-8c96-4107-ac9c-2b7f5a1d6c3e.gif width="350" height="200">
</p>


# :books: 기술 스텍

## :movie_camera: OpenVidu
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219276627-bb848643-ad9e-4d56-a455-550ef5d29627.PNG width="350" height="200">
</p>
![openvidu](https://user-images.githubusercontent.com/91431779/219276193-d0f9cfec-2f53-4428-af62-f0e07c05d2ca.PNG)

### OpenVidu는 웹 또는 모바일 애플리케이션에 실시간 커뮤니케이션을 쉽고 빠르게 추가할 수 있는 플랫폼입니다.
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219276397-292e389e-98bc-4eeb-b64d-ccd4d22b9401.gif width="350" height="200">
</p>

## teachable machine

### 리코더의 각 음계를 학습시켜 소리 인식을 통해 유저가 연주하는 음계를 파악하고 요구하는 음계와 맞는지 틀린지를 구분하게 하였습니다.
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219313753-cee19782-2ace-4167-9982-e71a25677db5.gif width="350" height="200">
<img src=https://user-images.githubusercontent.com/91431779/219312545-91f080bf-3033-4ba6-8e52-8cb729b08501.gif width="350" height="200">
</p>

### 학습시킨 모델에서 솔과 라를 각각 연주한 결과입니다. 튜토리코더에서는 음계별로 도출된 값을 이용하여 어떤 음계에 가장 가까운지 판단하였습니다.

# 기획 배경
코로나이후 많은 활동에 제약사항이 생겼는데 그 중에 하나가 초등학생들의 음악교육입니다.
음악교육은 아동들의 정서

# 서비스 개요

# 주요 기능

## Gamification 을 적용하여 사용자의 동기를 강화하여 참여를 유도
## 연주하기
<p align="center">
<img src=https://user-images.githubusercontent.com/91431779/219355238-8f3ef672-e072-4877-9d8e-359fdece03f1.gif width="500" height="200">
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


# 스토리보드

# 개발환경

# :speech_balloon: 협업 툴
+ GitLab
+ Notion
+ JIRA
+ MatterMost

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

>
<br>``` Epic ``` : BackEnd, FrontEnd, 기획, 설계
<br> ``` story ``` : 기획, 설계, 산출물 제작 등 개발외의 업무에 관한 업무 관리
<br> ``` task ``` : 코드 작성과 관련된 개발업무에 관한 업무 관리
## MatterMost
+ 일일 스크럼 회의록 관리
+ GitLab과 연동하여 실시간 GitLab 관리
+ Archiving채널을 통해서 각 종 정보 공유

# 팀원 소개
![image](https://user-images.githubusercontent.com/91431779/219308515-293ac4a8-b0b8-4d6c-a1a3-d56faad0b826.png)

# 회고


