<template>
    <div id="pink-container">
        <!-- 소리내기 게임 컴포넌트 -->
        <MultiSoundMain v-if="isPlaySound" @soundGameStop="soundGameStop" @emitGameStart="emitGameStart" @goMultiAnalize="goMultiAnalize" @goRoom="goRoom" @goRoomAlone="goRoomAlone" :isOwner="isOwner" :difficulty="difficulty" :publisher="publisher" :subscribers="subscribers" :soundGame="soundGame"/>
        <!-- 소리내기 게임 컴포넌트 끝-->

        <!-- 소리내기 게임 분석 -->
        <MultiAnalizeMain v-if="analizeVisible" @closeAnal="closeAnal" @closeAnalAlone="closeAnalAlone" :isOwner="isOwner" @sendMyTotalScore="sendMyTotalScore" :ranker="ranker"/>
        <!-- 소리내기 게임 분석 끝 -->

        <!-- 연주하기 게임 컴포넌트 -->
        <MultiSongMain v-if="isPlaySong" @goMultiSoloAnalizeGest="goMultiSoloAnalizeGest" @emitSongGameStop="emitSongGameStop" @emitSongGameStart="emitSongGameStart" @emitSongNumber="emitSongNumber" @goMultiSoloAnalize="goMultiSoloAnalize" @goRoom="goRoom" @goRoomAlone="goRoomAlone" :isOwner="isOwner" :publisher="publisher" :subscribers="subscribers" :songNumber="songNumber" :songGameStart="songGameStart" :propsSaveGameResult="propsSaveGameResult"/>
        <!-- 연주하기 게임 컴포넌트 끝 -->

        <!-- 연주하기 게임 분석 -->
        <MultiSoloAnalizeMain v-if="songAnalizeVisible" @closeAnal="closeAnal" @closeAnalAlone="closeAnalAlone" :isOwner="isOwner" @sendMyTotalScore="sendMyTotalScore" :ranker="ranker"/>
        <!-- 대기화면 내부 -->

        <!-- 왼쪽 박스 -->
        <div id="LeftBox" v-if="!isPlayGame">

            <!-- 대기방 비디오 디스플레이 -->
            <div id="YellowBoxVideo">
                    <user-video :stream-manager="publisher" :class="{ 'host': isOwner, 'no-ready': !isOwner}" id="my-video"/>
                    <user-video v-for="sub in subscribers" 
                                :key="sub.stream.connection.connectionId" 
                                :stream-manager="sub"
                                :id="sub.stream.connection.connectionId"
                                class="no-ready"/>
            </div>
            <!-- 대기방 비디오 디스플레이 끝 -->

            <div style="display:flex; flex-direction:row; ">
                <!-- 대기방 채팅창 -->
                <div style="display:flex; flex-direction:column;  width:100%; height: 100%; margin: 0; padding: 0; background-color: rgba(0, 0, 0, 0.374); box-shadow: 0 0 5px #333;">
                    <div id="GreenBoxChat" class="scroll" style="text-align:left;">
                        <p v-for="message in messageList" :key="message"  style="margin-left:0; margin-right:0;">
                            {{ message }}
                        </p>
                    </div>
                    <input v-model="chatMessage" clearable @keyup.enter="this.sendMessage" style="width:99.3%; height:10%; margin-top:3px;
                        background-color:rgba(0, 0, 0, 0.374); color: white;" />
                </div>
                <!-- 대기방 채팅창 끝-->
                
                <!-- 게임 시작/준비 전환 버튼 -->
                <div id="OrangeBoxStart"> 
                    <div v-if="isOwner">
                        <el-button id="ready-button" :type="startButton" :disabled="!startButtonEnabled" @click="startButtonConfirm" :class="{ 'can-push-button': startButtonEnabled, 'cannot-push-button': !startButtonEnabled,}">시작하기</el-button>
                    </div>
                    <div v-if="!isOwner && !readyButtonOn">
                        <el-button class="button-flicker can-push-button ready-button" type="warning" @click="this.readyButtonConfirm(); ">준비하기</el-button>
                    </div>
                    <div v-if="!isOwner && readyButtonOn">
                        <el-button type="success" @click="this.readyButtonConfirm" class="ready-button can-push-button">준비완료</el-button>
                    </div>
                </div>
                <!-- 게임 시작/준비 전환 버튼 끝 -->
            </div>

        </div>
        <!-- 왼쪽 박스 끝-->


        <!-- 오른쪽 박스 -->
        <div id="RightBox" v-if="!isPlayGame">

            <!-- 게임 세팅 창 -->
            <div id="PurpleBoxGameSetting">
                <!-- 방장인 경우 게임 정보를 세팅할 수 있도록 한다 -->
                <div v-if="isOwner" style="width:100%; height: 20vh">
                    <img  
                        src="../assets/gamesetting.png" 
                        alt="game setting img" 
                        style="width: 100%; height: 100%" 
                        @click="gameSettingVisible=true"
                        class="can-push-button"
                    >
                </div>
                
                <!-- 방장이 아닌 경우 게임 정보를 볼 수 있도록 한다-->
                <div  v-if="!isOwner" style="background-color: rgb(134,132,255); width:100%; height: 20vh; border-radius:20px">
                    <div style="padding-top: 1.5vh">
                        <p id="fontValue" style="color: white; margin: 0; font-size:2.4vw;"> 게임 정보 </p>
                        <div class="gameMode" id="fontValue" v-if='gameMode=="play"'>
                            게임 모드: 연주하기 <br/>
                            
                        </div>
                        <div class="gameMode" id="fontValue" v-if='gameMode=="sound"'>
                            게임 모드: 소리내기 <br/>
                            문제 당 시간: {{ difficulty }}초
                        </div>
                    </div>
                </div>

            </div>
            <!-- 게임 세팅 창 끝 -->


            <!-- 사용자 목록 -->
            <div id="BlueBoxUserList">
                <p id="fontValue" style="margin-top: 1.5vh; margin-bottom: 0; color: white; font-size: 2.4vw;">사용자 목록</p>

                <!-- 방장인 경우 참가자 확인 및 추방 기능을 추가한다 -->
                <div id="fontValue" v-if="this.isOwner">
                    <el-scrollbar height="250px">
                        <div class="user-scrollbar-item">{{ this.myUserName }}</div>
                        <div class="user-scrollbar-item" v-for="sub in subscribers" :key="sub.stream.connection.connectionId">
                            {{ jsonNameRendering(sub.stream.connection.data) }}
                            <img v-if="isOwner" 
                                src="../assets/Xbox.png" 
                                alt="Xbox img" 
                                style="width:18px; margin-left:10px; cursor:pointer" 
                                @click="outUser(sub)"> 
                        </div>
                    </el-scrollbar>
                </div>

                <!-- 참가자인 경우 사용자 목록을 확인한다-->
                <div id="fontValue" v-if="!this.isOwner">
                    <el-scrollbar height="250px">
                        <div class="user-scrollbar-item">{{ this.myUserName }}</div>
                        <div class="user-scrollbar-item" v-for="sub in subscribers" :key="sub.stream.connection.connectionId">
                            {{ jsonNameRendering(sub.stream.connection.data) }} 
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <!-- 사용자 목록 끝 -->


            <!-- 설정 박스 -->
            <div id="RedBoxRightBottom">
                <img src="../assets/goback.png" 
                    alt="game setting img" 
                    @click="leaveSession" 
                    style="cursor:pointer; 
                    width: 30%;
                    height: 100%;"
                    class="can-push-button"
                >
                <img src="../assets/share.png" 
                    alt="share img" 
                    style="cursor:pointer; 
                    width: 30%;
                    height: 100%;"
                    class="can-push-button"
                    @click="shareSettingVisible=true"
                >
                <img src="../assets/confsetting.png" 
                    alt="configuration setting img" 
                    @click="envSettingVisible=true" 
                    style="cursor:pointer; 
                    width: 30%;
                    height: 100%;"
                    class="can-push-button"
                >
            </div>
            <!-- 설정 박스 끝 -->
        </div>
        <!-- 오른쪽 박스 끝 -->

        <!-- 쉐어 모달 창 -->
        <el-dialog
            v-model="shareSettingVisible"
            width="35%"
            align-center
            style="border-radius: 10px; background-color: #DFE4F6;"
        >
            <template #default>
                <div id="share-modal-header">
                    <h2>코드 공유하기</h2>
                </div>
                <input class="code-input" v-model="roomCode" readonly/>

                <div style="display: flex; justify-content: center; margin-bottom: 10%;">
                    <div style="width: 40%;">
                        <a id="kakaotalk-sharing-btn" href="javascript:;" @click="kakaoButton">
                            <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                            alt="카카오톡 공유 보내기 버튼" />
                        </a>    
                    </div>
    
                    <div style="display:flex; flex-direction:column; align-items: center; width:40%;">
                        <!-- <img src="../assets/URL.png" alt="URL 공유하기" style="width:30%;"> -->
                        <el-button class="copy-button" v-if="!copyStatus" type="primary" @click="copyRoomCode">코드복사</el-button>
                        <el-button class="copy-button" v-if="copyStatus" type="success" @click="copyRoomCode">복사완료</el-button>
                    </div>
                </div>
                
            </template>

        </el-dialog>
        <!-- 쉐어 모달 창 끝 -->

        <!-- 게임설정 모달 창 -->
        <el-dialog 
            v-model="gameSettingVisible" 
            title="" 
            width="35%" 
            style="border-radius: 10px"
            background-color= "#DFE4F6"
        >
            <span>
                <img src="../assets/gamesetting.png" alt="game setting img in modal" style="width: 25px;">
                <h1 id="fontValue" >게임설정</h1>
            </span>
            <hr>

            <h2 id="fontValue" >게임선택</h2>
            <el-radio-group  id="fontValue" v-model="gameMode" class="ml-4">
                <el-radio label="play" size="large" border="true" @click="this.choosePlay">연주하기</el-radio>
                <el-radio label="sound" size="large" border @click="this.chooseSound">소리내기</el-radio>
            </el-radio-group>
            <hr>

            <!-- <h2 id="fontValue" >곡 선택 - 곡 연주</h2>
            <el-radio-group v-model="basicSong" class="ml-4">
                <el-radio id="fontValue"  label="airplane" size="large" border :disabled="optionEnabler">비행기</el-radio>
                <el-radio id="fontValue" label="anthem" size="large" border :disabled="optionEnabler">애국가</el-radio>
            </el-radio-group>
            <hr> -->

            <h2 id="fontValue" >난이도 선택 - 소리내기, 운지법</h2>
            <el-radio-group v-model="difficulty" class="ml-4">
                <el-radio id="fontValue" label="5" size="large" border :disabled="!optionEnabler">1단계(5초)</el-radio>
                <el-radio id="fontValue" label="4" size="large" border :disabled="!optionEnabler">2단계(4초)</el-radio>
                <el-radio id="fontValue" label="3" size="large" border :disabled="!optionEnabler">3단계(3초)</el-radio>
            </el-radio-group>
            <hr>
        
            <template #footer>
                <el-button id="settingComplete" type="success" @click="this.gameSettingConfirm">설정완료</el-button>
            </template>
        </el-dialog>
        <!-- 게임설정 모달 창 끝-->

        <!-- 환경설정 모달 창 -->
        <el-dialog 
            v-model="envSettingVisible" 
            width="30%" 
            style="border-radius: 10px; background-color: #DFE4F6;"
        >
            <span>
                <img 
                    src="../assets/confsetting.png" 
                    alt="configuration setting img in modal"
                    style="width: 45px;"
                >
                <h1 id="fontValue" >환경설정</h1>
            </span>
            <hr>

            <h2 id="fontValue" >카메라</h2>
            <el-radio-group v-model="cam" class="ml-4">
                <el-radio id="fontValue" label="on" size="large">켜기</el-radio>
                <el-radio id="fontValue" label="off" size="large">끄기</el-radio>
            </el-radio-group>
            <hr>

            <h2 id="fontValue" >마이크</h2>
            <el-radio-group v-model="mic" class="ml-4">
                <el-radio id="fontValue" label="on" size="large">켜기</el-radio>
                <el-radio id="fontValue" label="off" size="large">끄기</el-radio>
            </el-radio-group>
            <hr>
        
            <template #footer>
                <el-button id="settingComplete" type="success" @click="this.envSettingConfirm">설정완료</el-button>
            </template>
        </el-dialog>
        <!-- 환경설정 모달 창 끝-->
    </div>
</template>
<script>
import { OpenVidu } from "openvidu-browser";
import { mapState, mapActions } from "vuex"
import axios from "axios";
import UserVideo from "@/components/video/UserVideo.vue"
import MultiSongMain from "@/components/multi/MultiSongMain.vue";
import MultiSoundMain from "@/components/multi/MultiSoundMain.vue";
import MultiAnalizeMain from "@/components/multi/MultiAnalizeMain.vue";
import MultiSoloAnalizeMain from "@/components/multi/MultiSoloAnalizeMain.vue";

axios.defaults.headers.post["Content-Type"] = "application/json";
const APPLICATION_SERVER_URL = "http://localhost:5000/";
// const APPLICATION_SERVER_URL = "https://i8c206.p.ssafy.io/";

export default {
    name: 'PlayRoomView',
    components: {
        UserVideo,
        MultiSongMain,
        MultiSoundMain,
        MultiAnalizeMain,
        MultiSoloAnalizeMain,
    },
    data() {
        return {
            OV: undefined,
            session: undefined,
            //
            publisher: undefined,
            roomCode: '',
            audioEnabled: true,
            videoEnabled: true,
            subscribers: [],
            //
            isOwner: false,
            gameSettingVisible: false,
            envSettingVisible: false,
            gameMode: undefined,
            basicSong: undefined,
            difficulty: undefined,
            chatMessage: '',
            messageList: [],
            optionEnabler: false,
            countReady: 0,
            startButton: "primary",
            startButtonEnabled: true,
            readyButtonOn: false,
            cam: "on",
            mic: "on",
            isPlaySound: false,
            isPlaySong: false,
            isPlayGame: false,
            analizeVisible: false,
            songAnalizeVisible: false,
            soundGame: false,
            shareSettingVisible:false,
            copyStatus:false,
            ranker: {},
            songNumber: "0",
            songGameStart: false,
            propsSaveGameResult: false,
        }   
    },
    watch: {
        shareSettingVisible() {
            if (this.shareSettingVisible == false) {
                this.copyStatus = false;
            }
        },
    },
    mounted() {
        // Check if the URL already has a room
        // (+) Furthermore, Use database/backend to check if the room code is valid or not
        this.checkMounted();
       
    },
    
    beforeUnmount() {
        this.leaveSession();
    },
    computed: {
        ...mapState(['myUserName']),

    },
    methods: {
        ...mapActions(['saveGameResult', 'initMySessionId', 'initGameResult']),
        emitSongGameStop: function() {
            this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'emit-song-game-stop'
                })
                .then(() => {
                })  
                .catch(error => {
                    console.log(error);
                })
        },
        emitSongGameStart: function() {
            this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'emit-song-game-start'
                })
                .then(() => {
                })  
                .catch(error => {
                    console.log(error);
                })
        },
        emitSongNumber: function(value) {
            this.publisher.session.signal({
                    data: value,
                    to: [],
                    type: 'emit-song-number'
                })
                .then(() => {
                })  
                .catch(error => {
                    console.log(error);
                })
        },
        kakaoButton: function() {
            window.Kakao.Share.createDefaultButton({
                container: '#kakaotalk-sharing-btn',
                objectType: 'text',
                text:
                '튜토리코더 코드: ' + this.roomCode,
                link: {
                mobileWebUrl: 'https://i8c206.p.ssafy.io',
                webUrl: 'https://i8c206.p.ssafy.io',
                },
            });
        },  
        copyRoomCode: function() {
            this.copyStatus=false
            navigator.clipboard.writeText(this.roomCode);
            this.copyStatus=true
        },
        soundGameStop: function() {
            this.soundGame = false;
            this.findHost();
        },
        emitGameStart: function() {
            this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'start-sound-game'
                })
                .then(() => {
                })  
                .catch(error => {
                    console.log(error);
                })
        },
        startButtonConfirm: function() {
            this.ranker = {};
            this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'start-game'
                })
                .then(() => {
                })
                .catch(error => {
                    console.log(error);
                })
        },
        envSettingConfirm: function() {
            if (this.mic == "on") {
                this.publisher.publishAudio(true);
            } else {
                this.publisher.publishAudio(false);
            }

            if (this.cam == "on") {
                this.publisher.publishVideo(true);
            } else {
                this.publisher.publishVideo(false);
            }

            this.envSettingVisible=false
        },
        readyButtonConfirm: function() {
            const myVideo = document.getElementById('my-video')
            if (this.readyButtonOn) {
                // 준비 버튼이 활성화가 되어 있는 경우
                this.readyButtonOn = false;
                this.count--;
                this.readyButton = "warning";

                myVideo.setAttribute('class', 'no-ready')

                this.publisher.session.signal({
                    data: this.publisher.stream.connection.connectionId,
                    to: [],
                    type: 'ready-minus'
                })
                .then(() => {
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else {
                // 준비 버튼이 활성화가 되어 있지 않는 경우
                this.readyButtonOn = true;
                this.count++;
                this.readyButton = "success";

                myVideo.setAttribute('class', 'ready')

                this.publisher.session.signal({
                    data: this.publisher.stream.connection.connectionId,
                    to: [],
                    type: 'ready-plus'
                })
                .then(() => {
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        choosePlay: function() {
            this.optionEnabler = false;
            this.gameMode = "play";
            this.basicSong = "airplane";
            this.difficulty = undefined;
        },
        chooseSound: function() {
            this.optionEnabler = true;
            this.gameMode = "sound";
            this.basicSong = undefined;
            this.difficulty = "5";
        },
        gameSettingConfirm: function() {
            this.gameSettingVisible = false;
            let obj = {
                "gameMode" : this.gameMode,
                "basicSong" : this.basicSong,
                "difficulty" : this.difficulty
            }

            this.publisher.session.signal({
                data: JSON.stringify(obj),
                to: [],
                type: 'game-setting'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        jsonNameRendering: function(data) {
            const { clientData } = JSON.parse(data);
            const isExistName = this.subscribers.some(function(element) {
                return JSON.parse(element.stream.connection.data)['clientData'] === clientData;
            });
            if (this.isOwner && isExistName) {
                return clientData + '(' + Math.floor(Math.random() * 10000) + ')';
            }
            return clientData;
        },
        checkMounted: function() {
            this.roomCode = window.location.hash.slice(1);

            if (this.roomCode) {
                // 방 들어오기 모드
                // 해당 코드로 만들어진 방이 존재하는지 확인이 먼저 필요하다
                // 확인이 완료되면 joinRoom 진행
                // numOfVideo에 따라서 접근을 제한하자

                this.joinRoom();
            }
            else {
                // 방 생성 모드
                // 방 생성을 위해 코드를 먼저 생성해야 한다
                this.roomCode = this.randomString();         
                this.createRoom();       
            } 
        },
        leaveSession: function() {
            if (this.session) this.session.disconnect();
            this.session = undefined;
            this.publisher = undefined;
            this.subscribers = [];
            this.OV = undefined;
            this.isOwner = false;
            this.roomCode = '';
            this.audioEnabled = true;
            this.videoEnabled = true;
            this.gameMode = undefined;
            this.basicSong = undefined;
            this.difficulty = undefined;
            this.messageList = [];
            this.gameSettingVisible = false;
            this.envSettingVisible = false;
            this.countReady = 0;
            this.startButton = "success";
            this.readyButton = "warning";
            this.startButtonEnabled = true;
            this.readyButtonOn = false;
            this.cam = "on";
            this.mic = "on";
           
            window.location.href = window.location.origin + '/mode';
        },
        outUser(member) {
            const memberId = member.stream.connection.connectionId
            this.publisher.session.signal({
                data: memberId,
                to: [],
                type: "out"
            });
        },
        sendMessage() {
            this.publisher.session.signal({
                data: this.chatMessage,
                to: [],
                type: 'my-chat'
            })
            .then(() => {

                // 스크롤바 추적1 : 3까지
                // 스크롤 내리기 위해 필요한 부분
                const $el = document.querySelector(".scroll");
                $el.scrollTop = $el.scrollHeight;
                // 스크롤 내리기 위해 필요한 부분 끝
            })
            .catch(error => {
                console.error(error);
            })

            this.chatMessage = '';

        }, 
        startGame() {
            if (this.gameMode === 'play') {
                this.isPlayGame = true
                this.isPlaySong = true
                this.isPlaySound = false
            } else if (this.gameMode === 'sound') {
                this.isPlayGame = true
                this.isPlaySong = false
                this.isPlaySound = true
            }
        },
        goRoom() {
            this.initGameResult()
            this.findHost();
            this.whoIsReady()
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'go-room'
            })
            .then(() => {
            })
            .catch(error => {
                console.log(error)
            })
        },
        goRoomAlone() {
            this.initGameResult()
            this.findHost();
            this.whoIsReady()
            this.isPlayGame = false
            this.isPlaySong = false
            this.isPlaySound = false
            this.songAnalizeVisible = false
            this.analizeVisible = false
            this.publisher.publishAudio(true);
        },
        goMultiAnalize() {
            this.findHost();
            this.whoIsReady()
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'multi-anal'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        goMultiSoloAnalize() {
            this.findHost();
            this.whoIsReady()
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'song-multi-anal'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error)
            })
        },
        closeAnal() {
            this.initGameResult()
            this.findHost();
            this.whoIsReady()
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'close-anal'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        findHost() {
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'who-is-host'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        iAmHost() {
            this.publisher.session.signal({
                data: this.publisher.stream.connection.connectionId,
                to: [],
                type: 'i-am-host'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        closeAnalAlone() {
            this.findHost();
            this.whoIsReady()
            this.initGameResult()
            this.analizeVisible = false
            this.songAnalizeVisible = false
        },
        sendMyTotalScore(data) {
            const memberName = JSON.parse(this.publisher.stream['connection']['data'])['clientData']
            this.ranker[this.publisher.stream.connection.connectionId] = [memberName, data];
            this.publisher.session.signal({
                data: JSON.stringify(this.ranker),
                to: [],
                type: 'everyone-data'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        goMultiSoloAnalizeGest() {
            this.findHost();
            this.whoIsReady()
            this.propsSaveGameResult = false
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'song-multi-anal-gest'
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            })
        },
        whoIsReady: function() {
            this.publisher.session.signal({
                data: '',
                to: [],
                type: 'who-is-ready'
            })
            .then(() => {
            })
            .catch(error => {
                console.log(error);
            })
        },
        thisIsMyReadyStatus: function() {
            if (this.readyButtonOn) {
                // 준비 버튼이 활성화가 되어 있는 경우
                this.publisher.session.signal({
                    data: this.publisher.stream.connection.connectionId,
                    to: [],
                    type: 'i-am-ready'
                })
                .then(() => {
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else {
                // 준비 버튼이 활성화가 되어 있지 않는 경우
                this.publisher.session.signal({
                    data: this.publisher.stream.connection.connectionId,
                    to: [],
                    type: 'i-am-not-ready'
                })
                .then(() => {
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        createRoom: function() {

            // 1) Get an OpenVidu Object
            this.OV = new OpenVidu();

            // 2) Init a Session
            this.session = this.OV.initSession();

            // 3) Spcify the actions when events take place in the session
            // 3-1) streamCreated
            this.session.on('streamCreated', ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber);
                this.gameSettingConfirm();
                if (this.countReady != this.subscribers.length) {
                    this.startButtonEnabled = false;
                    this.startButton = "danger";
                }
            }) 

            // 3-2) streamDestroyed
            this.session.on('streamDestroyed', ({ stream }) => {
                const { isOwner } = JSON.parse(stream.connection.data);
                if (isOwner) {
                    alert("세션이 종료되었습니다.");
                    this.leaveSession();
                    return;
                }

                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }

                if (this.countReady == this.subscribers.length) {
                    this.startButtonEnabled = true;
                    this.startButton = "primary";
                }
            })

            // 3-3) stream kicked out
            this.session.on("signal:out", async (event) => {
                let id = event.data;

                if (id == this.publisher.stream.connection.connectionId) {
                    alert("세션에서 추방당하셨습니다.");
                    this.leaveSession();
                    return;
                }
            })

            // 3-4) exception
            this.session.on("exception", ({ exception }) => {
                console.warn(exception);
            })

            // 3-5) chat
            this.session.on('signal:my-chat', (event) => {
                let inMessage = event.data;
                let { clientData } = JSON.parse(event.from.data);
                
                this.messageList.push(clientData + ": " + inMessage);
                
                
                // 스크롤바 추적2
                const $el = document.querySelector(".scroll");
                $el.scrollTop = $el.scrollHeight
            })

            // 3-7) ready plus
            this.session.on('signal:ready-plus', (event) => {
                const targetId = event.data
                this.countReady++;
                if (this.countReady == this.subscribers.length) {
                    // 추가
                    this.startButtonEnabled = true;
                    this.startButton = "primary";
                }
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'ready')
                }
            })
            

            // 3-8) ready minus
            this.session.on('signal:ready-minus', (event) => {
                const targetId = event.data
                this.countReady--;
                this.startButtonEnabled = false;
                this.startButton = "danger";
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'no-ready')
                }
            })

            // 3-9) start game
            this.session.on('signal:start-game', () => {
                this.startGame();
                this.publisher.publishAudio(false);
            })

            // 3-10) start sound game
            this.session.on('signal:start-sound-game', () => {
                this.soundGame = true;
            })

            // 3-11) multi-anal
            this.session.on('signal:multi-anal', () => {
                this.isPlayGame = false
                this.isPlaySong = false
                this.isPlaySound = false
                this.soundGame = false
                this.analizeVisible = true
                this.songAnalizeVisible = false
                this.publisher.publishAudio(true);
            })
        
            // 3-12) go-room
            this.session.on('signal:go-room', () => {
                this.isPlayGame = false
                this.isPlaySong = false
                this.isPlaySound = false
                this.soundGame = false
                this.analizeVisible = false
                this.songAnalizeVisible = false
                this.publisher.publishAudio(true);
            })

            // 3-13) close-anal
            this.session.on('signal:close-anal', () => {
                this.analizeVisible = false
                this.songAnalizeVisible = false
                this.soundGame = false
            })

            // 3-14) who is host
            this.session.on('signal:who-is-host', () => {
                if (this.isOwner === true) {
                    this.iAmHost()
                }
            })

            // 3-15) everyone data
            this.session.on('signal:everyone-data', (event) => {
                const result = JSON.parse(event.data)
                this.ranker[Object.keys(result)[0]] = Object.values(result)[0]
                if (Object.keys(this.ranker).length === this.subscribers.length + 1) {
                    let sortedObject = Object.fromEntries(
                        Object.entries(this.ranker).sort(([, [, a]], [, [, b]]) => b - a)
                    );
                    this.ranker = sortedObject
                }
            })

            // 3-16) emit song number
            this.session.on('signal:emit-song-number', (event) => {
                this.songNumber = event.data;
            })

            // // 3-17) emit song game start
            // this.session.on('signal:emit-song-game-start', () => {
            //     this.songGameStart = true;
            // })

            // // 3-18) emit song game stop
            // this.session.on('signal:emit-song-game-stop', () => {
            //     this.songGameStart = false;
            // })

            // 3-19) song multi anal
            this.session.on('signal:song-multi-anal', () => {
                this.isPlayGame = false
                this.isPlaySong = false
                this.isPlaySound = false
                this.soundGame = false
                this.analizeVisible = false
                this.songAnalizeVisible = true
                this.publisher.publishAudio(true);
            })

            // 3-20) i am ready
            this.session.on('signal:i-am-ready', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'ready')
                }
            })

            // 3-21) i am not ready
            this.session.on('signal:i-am-not-ready', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'no-ready')
                }
            })


            // 4) Get a token from the OpenVidu deployment
            this.getToken(this.roomCode).then((token) => {
                this.session.connect(token, { clientData: this.myUserName, isOwner: true })
                    .then(() => {
                        let path = (location.pathname.slice(-1) == "/" ? location.pathname : location.pathname + "/");
                        window.history.pushState("", "", path + "#" + this.roomCode);


                        let publisher = this.OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            resolution: "240x160",
                            frameRate: 30,
                            insertMode: "Append",
                            mirror: false,
                        });

                        this.publisher = publisher;


                        this.session.publish(this.publisher);

                        // 최대 정원 설정 가능

                        // Owner 설정
                        this.isOwner = true;
                        
                        // Game 설정
                        this.optionEnabler = false;
                        this.gameMode = "play";
                        this.basicSong = "airplane";
                        this.difficulty = undefined;
                       
                    })
                    .catch((error) => {
                        console.log("There was an error connecting to the session: ", 
                                    error.code, 
                                    error.message);
                    })
            })
        },
        joinRoom: function() {
            // console.log("룸코드로 접속: ", this.roomCode);

            // 1) Get an OpenVidu Object
            this.OV = new OpenVidu();

            // 2) Init a Session
            this.session = this.OV.initSession();


            // 3) Spcify the actions when events take place in the session
            // 3-1) streamCreated
            this.session.on('streamCreated', ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber);
            })


            // 3-2) streamDestroyed
            this.session.on('streamDestroyed', ({ stream }) => {
                const { isOwner } = JSON.parse(stream.connection.data);
                if (isOwner) {
                    this.leaveSession();
                    alert("세션이 종료되었습니다.");
                    return;
                }

                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }
            })

            // 3-3) stream kicked out
            this.session.on("signal:out", async (event) => {
                let id = event.data;

                if (id == this.publisher.stream.connection.connectionId) {
                    this.leaveSession();
                    alert("방에서 추방당하셨습니다.");
                }
            })

            // 3-4) exception
            this.session.on("exception", ({ exception }) => {
                console.warn(exception);
            })

            // 3-5) chat
            this.session.on('signal:my-chat', (event) => {
                let inMessage = event.data;
                let { clientData } = JSON.parse(event.from.data);

                this.messageList.push(clientData + ": " + inMessage);

                // 스크롤바 추적
                const $el = document.querySelector(".scroll");
                $el.scrollTop = $el.scrollHeight*2;
            })

            // 3-6) game setting
            this.session.on('signal:game-setting', (event) => {
                let { gameMode } = JSON.parse(event.data);
                if (gameMode === "play") {
                    let { basicSong } = JSON.parse(event.data);

                    this.gameMode = gameMode;
                    this.basicSong = basicSong;
                    this.difficulty = undefined;
                }
                else {
                    let { difficulty } = JSON.parse(event.data);

                    this.gameMode = gameMode;
                    this.basicSong = undefined;
                    this.difficulty = difficulty;
                }
            })

            // 3-7) start game
            this.session.on('signal:start-game', () => {
                this.startGame();
                this.publisher.publishAudio(false);
                this.readyButtonConfirm()
            })

            // 3-8) start sound game
            this.session.on('signal:start-sound-game', () => {
                this.soundGame = true;
            })

            
            // 3-9) multi-anal
            this.session.on('signal:multi-anal', () => {
                this.isPlayGame = false
                this.isPlaySong = false
                this.isPlaySound = false
                this.analizeVisible = true
                this.songAnalizeVisible = false
                this.soundGame = false
                this.publisher.publishAudio(true);
            })
        
            // 3-10) go-room
            this.session.on('signal:go-room', () => {
                this.isPlayGame = false
                this.isPlaySong = false
                this.soundGame = false
                this.isPlaySound = false
                this.analizeVisible = false
                this.songAnalizeVisible = false
                this.publisher.publishAudio(true);
            })

            // 3-13) close-anal
            this.session.on('signal:close-anal', () => {
                this.analizeVisible = false
                this.soundGame = false
                this.songAnalizeVisible = false
            })

             // 3-14) ready plus
             this.session.on('signal:ready-plus', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'ready')
                }
            })
            

            // 3-15) ready minus
            this.session.on('signal:ready-minus', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'no-ready')
                }
            })

            // 3-16) i-am-host
            this.session.on('signal:i-am-host', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'host')
                }
            })

            // 3-17) everyone data
            this.session.on('signal:everyone-data', (event) => {
                const result = JSON.parse(event.data)
                this.ranker[Object.keys(result)[0]] = Object.values(result)[0]
                if (Object.keys(this.ranker).length === this.subscribers.length + 1) {
                    let sortedObject = Object.fromEntries(
                        Object.entries(this.ranker).sort(([, [, a]], [, [, b]]) => b - a)
                    );
                    this.ranker = sortedObject
                }
            })
            
            // 3-18) emit song number
            this.session.on('signal:emit-song-number', (event) => {
                this.songNumber = event.data;
            })

            // 3-19) emit song game start
            this.session.on('signal:emit-song-game-start', () => {
                this.songGameStart = true;
            })

            // 3-20) emit song game stop
            this.session.on('signal:emit-song-game-stop', () => {
                this.songGameStart = false;
            })

            // 3-21) song multi anal
            this.session.on('signal:song-multi-anal', () => {
                this.propsSaveGameResult = true
            })

            // 3-22) song multi anal gest
            this.session.on('signal:song-multi-anal-gest', () => {
                this.isPlayGame = false
                this.isPlaySong = false
                this.isPlaySound = false
                this.soundGame = false
                this.analizeVisible = false
                this.songAnalizeVisible = true
                this.publisher.publishAudio(true);
            })

            // 3-23) who is ready
            this.session.on('signal:who-is-ready', () => {
                this.thisIsMyReadyStatus()
            })

            // 3-24) i am ready
            this.session.on('signal:i-am-ready', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'ready')
                }
            })

            // 3-25) i am not ready
            this.session.on('signal:i-am-not-ready', (event) => {
                const targetId = event.data
                const targetDiv = document.getElementById(targetId)
                if (targetDiv !== null) {
                    targetDiv.setAttribute('class', 'no-ready')
                }
            })


            // 4) Get a token from the OpenVidu deployment
            this.getToken(this.roomCode).then((token) => {
                this.session.connect(token, { clientData: this.myUserName, isOwner: false })
                    .then(() => {
                        let path = (location.pathname.slice(-1) == "/" ? location.pathname : location.pathname + "/");
                        window.history.pushState("", "", path + "#" + this.roomCode);


                        let publisher = this.OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            resolution: "240x160",
                            frameRate: 30,
                            insertMode: "Append",
                            mirror: false,
                        });

                        this.publisher = publisher;

                        this.session.publish(this.publisher);

                        if (this.session.streamManagers.length === 0) {
                            this.leaveSession();
                        }

                        this.findHost()
                        this.whoIsReady()

                    })
                    .catch((error) => {
                        console.log("There was an error connecting to the session: ", 
                                    error.code, 
                                    error.message);
                    })
            })
        },
        randomString: function() {
            // 룸코드 생성을 위한 랜덤 문자열 생성
            return Math.random().toString(36).slice(2);
        },
        async getToken(myRoomCode) {
            const sessionId = await this.createSession(myRoomCode);
            return await this.createToken(sessionId);
        },
        async createSession(roomCode) {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', 
            { customSessionId: roomCode }, { headers: { 'Content-Type': 'application/json' }});

            return response.data;
        },
        async createToken(sessionId) {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
            {}, { headers: { 'Content-Type': 'application/json' }});

            return response.data;
        },

    },
}
</script>
<style scoped>

  li {
    text-align: left;;
    margin-left: 5px;
  }

  #pink-container{
    width: 95vw;
    height: 95vh;
    background-color: #F2E6E6;
    margin: auto;
    border-radius: 30px;
    padding:0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 3;
    border-radius: 30px;
  }

  #BlackBoxLargestBox{
    display: flex;
    flex-direction: row;
    border: 5px solid black;
    margin: 0;
    padding: 0;
    margin-top:5px;
  }

  #LeftBox{
    /* border: 5px solid orange; */
    margin: 0;
    padding: 0;
    width: 82.5%;
    height: 95%;
    
  }
  #YellowBoxVideo{
    /* border: 5px solid yellow; */
    display: flex;  
    flex-wrap: wrap;
    justify-content: flex-start;
    width:99%;
    height:65%;
    margin: 0;
    padding: 10;
  }
  #GreenBoxChat{
    /* border: 5px solid rgba(191, 180, 180, 0.6); */
    border-radius: 10px;
    display: inline-block;
    width: 100%;
    height: 25vh;
    margin: 0;      
    padding: 0;
    left: 20%;
    /* background-color: rgb(142, 140, 140); */
    color: rgb(219,206,206);
  }
  #OrangeBoxStart{
    /* border: 5px solid orange; */
    display: inline-block;
    width: 35%; 
    height: 80%;
  }
  .ready-button{
    height: 19.5vh;
    font-family: 'JUA', serif;  
    font-size: 3vw;
  }
  #ready-button{
    height: 20vh;
    font-family: 'JUA', serif;  
    font-size: 3vw;
  }

  #RightBox{
    /* border: 5px solid hotpink; */
    margin: 0;
    padding: 0;
    width: 12.5%;
    height: 95%;
  }
  #PurpleBoxGameSetting{
    /* border : 5px solid purple; */
    padding: 0;
    margin: auto;
  }
  .gameMode{
    margin-top: 2.4vh;
    color: white;
    font-size: 1.2vw;
  }
  #BlueBoxUserList{
    margin-top: 1.5vh;
    margin-bottom: 1.5vh;
    padding: 0;
    /* border: 5px solid blue; */
    height: 63%;
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 10px;
  }
  #RedBoxRightBottom{
    margin: 0;
    padding: 0;
    /* border: 5px solid red; */
    display: flex;
    justify-content: space-between;
    height: 7%;
  }

  #fontValue{
    font-family: 'JUA', serif;
  }

  #settingComplete{
    display: flex;
    justify-items: center;
    width: 40%;
    height: 20%;
    margin: auto;
    font-size: 1.5vw;
    font-family: 'JUA', serif;  
}


  /* User List Scrollbar*/
  .user-scrollbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10%;
    margin: 1vh;
    text-align: center;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.374);
    box-shadow: 0 0 5px #333;
    color: white;
    font-family: 'JUA', serif;
    font-size: 1.2vw;
  }

  /* chat-scollbar-item */
  .chat-scrollbar-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 25px;
    margin: 10px;
    text-align: left;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 5px #333;
    border: 5px solid red;
  }

  /* volume slider */
  .slider-demo-block {
    display: flex;
    align-items: center;
  }
  .slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
  }
  /* volume slider */



  /* chat slider test */
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

* {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto,
    "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
    "Malgun Gothic", sans-serif;
}

.scroll {
  height: 300px; 
  width: 80vw;
  overflow-y: scroll;
}

button {
  cursor: pointer;
  margin-bottom: 1rem;
  /* background: #febf00; */
  border: none;
  padding: .6rem 1.5rem;
  border-radius: .3rem;
  font-size: 2.25rem;
  width: 90%;
  height: 160px;
}

.scroll > div span {
  display: inline-block;
  max-width: 100%;
  border-top-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  padding: 0.8rem 1.2rem;
  background-color: #ececff;
  margin-top: .6rem;
}


/* 스크롤바 커스텀 */
.scroll::-webkit-scrollbar {
  background-color: #fff;
  width: 1rem;
}

.scroll::-webkit-scrollbar-track {
  background-color: #fff;
}

.scroll::-webkit-scrollbar-thumb {
  height: 15%;
  background-color: #babac0;

  border-radius: 1rem;
  border: 4px solid #fff;
}

/* 버튼 플리커 */
@keyframes flickerAnimation {
  0%   { opacity:1; }
  50%  { opacity:0.5; }
  100% { opacity:1; }
}
@-o-keyframes flickerAnimation{
  0%   { opacity:1; }
  50%  { opacity:0.5; }
  100% { opacity:1; }
}
@-moz-keyframes flickerAnimation{
  0%   { opacity:1; }
  50%  { opacity:0.5; }
  100% { opacity:1; }
}
@-webkit-keyframes flickerAnimation{
  0%   { opacity:1; }
  50%  { opacity:0.5; }
  100% { opacity:1; }
}
.button-flicker {
   -webkit-animation: flickerAnimation 1s infinite;
   -moz-animation: flickerAnimation 1s infinite;
   -o-animation: flickerAnimation 1s infinite;
    animation: flickerAnimation 1s infinite;
}

.can-push-button{
    cursor: url(../assets/cursor_click.png), auto !important;
}
.cannot-push-button{
    cursor: url(../assets/cursor_disable.png), auto !important;
}

#share-modal-header {
    margin-bottom: 40px !important
}

#share-modal-button {
    display: flex;
    justify-items: center;
    width: 20%;
    height: 20%;
    margin: auto;
    font-size: 1vw;
    font-family: 'JUA', serif;  
}

.copy-button {
    display:inline-block;
    width: 70px;
    height: 70px;
    margin: auto;
    padding: 0;
    font-size: 15px;
    font-family: 'JUA', serif;
    border-radius: 100px;
}
.code-input {
  width: 17vw !important;
  text-align: center;
  font-family: 'JUA', serif;
  border-radius: 10px;
  margin-bottom: 10%;
}
.host{
    border: 5px solid rgb(230, 113, 24);
    height: 25vh;
    border-radius: 10px;
    margin: 2%; 
    margin-top: 0.75%;
    margin-bottom: 0.75%;
    padding: 0;  
    height: 42%;
}
.ready{
  border: 5px solid blue;
  height: 25vh;
  border-radius: 10px;
  margin: 2%;
    margin-top: 0.75%;
    margin-bottom: 0.75%;
    padding: 0;  
    height: 42%;
 }
 .no-ready{
  border: 5px solid rgba(191, 180, 180, 0.6);
  height: 25vh;
  border-radius: 10px;
    margin: 2%;
    margin-top: 0.75%;
    margin-bottom: 0.75%;
    padding: 0;  
    height: 42%;
 }

</style>