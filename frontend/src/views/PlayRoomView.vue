<template>
    <div id="pink-container">

        <!-- 소리내기 게임 컴포넌트 -->
        <MultiSoundMain v-if="isPlaySound" @goMultiAnalize="goMultiAnalize" @goRoom="goRoom" :difficulty="difficulty" :publisher="publisher" :subscribers="subscribers"/>
        

        
        
        <!-- 소리내기 게임 분석 -->
        <MultiAnalizeMain v-if="analizeVisible" @close-modal="analizeVisible=false"/>

        <!-- 소리내기 게임 분석 끝 -->

        <!-- 연주하기 게임 컴포넌트 -->
        <MultiSongMain v-if="isPlaySong" @goMultiAnalize="goMultiAnalize" @goRoom="goRoom"/>

        <!-- 왼쪽 박스 -->
        <div id="LeftBox" v-if="!isPlayGame">

            <!-- 대기방 비디오 디스플레이 -->
            <div id="YellowBoxVideo">
                <span id="video-container">
                    <user-video :stream-manager="publisher"/>
                    <user-video v-for="sub in subscribers" 
                                :key="sub.stream.connection.connectionId" 
                                :stream-manager="sub" />
                </span>
            </div>
            <!-- 대기방 비디오 디스플레이 끝 -->

            

            <div style="display:flex; flex-direction:row; ">
                <!-- 대기방 채팅창 -->
                <div style="display:flex; flex-direction:column;  width:100%; margin: 0; padding: 0;">
                    <div id="GreenBoxChat" class="scroll" style="text-align:left;">
                        <p v-for="message in messageList" :key="message"  style="margin-left:0; margin-right:0;">
                            {{ message }}
                        </p>
                    </div>
                    <input v-model="chatMessage" clearable @keyup.enter="this.sendMessage" style="width:98.5%; margin-top:3px;" />
                </div>
                <!-- 대기방 채팅창 끝-->
                
                <!-- 게임 시작/준비 전환 버튼 -->
                <div id="OrangeBoxStart"> 
                    <div v-if="isOwner">
                        <el-button :type="startButton" :disabled="!startButtonEnabled" @click="startButtonConfirm">시작하기</el-button>
                    </div>
                    <div v-if="!isOwner && !readyButtonOn">
                        <el-button class="button-flicker" type="warning" @click="this.readyButtonConfirm">준비하기</el-button>
                    </div>
                    <div v-if="!isOwner && readyButtonOn">
                        <el-button type="success" @click="this.readyButtonConfirm">준비완료</el-button>
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
                <img v-if="isOwner" 
                     src="../assets/gamesetting.png" 
                     alt="game setting img" 
                     style="width:100%; cursor:pointer;" 
                     @click="gameSettingVisible=true"
                >
                <!-- 방장이 아닌 경우 게임 정보를 볼 수 있도록 한다-->
                <div v-if="!isOwner">
                    <h1> 게임 정보 </h1>
                    <div v-if='gameMode=="play"'>
                        게임 모드: {{ gameMode }} <br/>
                        곡 이름: {{ basicSong }}
                    </div>
                    <div v-if='gameMode=="sound"'>
                        게임 모드: {{ gameMode }} <br/>
                        난이도: {{ difficulty }}
                    </div>
                </div>
            </div>
            <!-- 게임 세팅 창 끝 -->


            <!-- 사용자 리스트 -->
            <div id="BlueBoxUserList">
                <h1>유저 리스트</h1>

                <!-- 방장인 경우 참가자 확인 및 추방 기능을 추가한다 -->
                <div v-if="this.isOwner">
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
                <div v-if="!this.isOwner">
                    <el-scrollbar height="250px">
                        <div class="user-scrollbar-item">{{ this.myUserName }}</div>
                        <div class="user-scrollbar-item" v-for="sub in subscribers" :key="sub.stream.connection.connectionId">
                            {{ jsonNameRendering(sub.stream.connection.data) }} 
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <!-- 사용자 리스트 끝 -->


            <div id="RedBoxRightBottom">
                <img src="../assets/goback.png" 
                    alt="game setting img" 
                    @click="leaveSession" 
                    style="cursor:pointer; 
                    width: 45px; "
                >
                <img src="../assets/share.png" 
                    alt="share img" 
                    style="cursor:pointer; 
                    width: 45px; height: 45px;"
                    
                >
                <img src="../assets/confsetting.png" 
                    alt="configuration setting img" 
                    @click="envSettingVisible=true" 
                    style="cursor:pointer; width: 45px;"
                >
            </div>
        </div>
        <!-- 오른쪽 박스 끝 -->

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
                <h1>게임설정</h1>
            </span>
            <hr>

            <h2>게임선택</h2>
            <el-radio-group v-model="gameMode" class="ml-4">
                <el-radio label="play" size="large" border="true" @click="this.choosePlay">연주하기</el-radio>
                <el-radio label="sound" size="large" border @click="this.chooseSound">소리내기</el-radio>
            </el-radio-group>
            <hr>

            <h2>곡 선택 - 곡 연주</h2>
            <el-radio-group v-model="basicSong" class="ml-4">
                <el-radio label="airplane" size="large" border :disabled="optionEnabler">비행기</el-radio>
                <el-radio label="anthem" size="large" border :disabled="optionEnabler">애국가</el-radio>
            </el-radio-group>
            <hr>

            <h2>난이도 선택 - 소리내기, 운지법</h2>
            <el-radio-group v-model="difficulty" class="ml-4">
                <el-radio label="5" size="large" border :disabled="!optionEnabler">1단계(5초)</el-radio>
                <el-radio label="4" size="large" border :disabled="!optionEnabler">2단계(4초)</el-radio>
                <el-radio label="3" size="large" border :disabled="!optionEnabler">3단계(3초)</el-radio>
            </el-radio-group>
            <hr>
        
            <template #footer>
                <el-button type="success" @click="this.gameSettingConfirm">설정완료</el-button>
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
                <h1>환경설정</h1>
            </span>
            <hr>

            <h2>카메라</h2>
            <el-radio-group v-model="cam" class="ml-4">
                <el-radio label="on" size="large">켜기</el-radio>
                <el-radio label="off" size="large">끄기</el-radio>
            </el-radio-group>
            <hr>

            <h2>마이크</h2>
            <el-radio-group v-model="mic" class="ml-4">
                <el-radio label="on" size="large">켜기</el-radio>
                <el-radio label="off" size="large">끄기</el-radio>
            </el-radio-group>
            <hr>
        
            <template #footer>
                <el-button type="success" @click="this.envSettingConfirm">설정완료</el-button>
            </template>
        </el-dialog>
        <!-- 환경설정 모달 창 끝-->
    </div>
</template>
<script>
import { OpenVidu } from "openvidu-browser";
import { mapState } from "vuex"
import axios from "axios";
import UserVideo from "@/components/video/UserVideo.vue"
import MultiSongMain from "@/components/multi/MultiSongMain.vue";
import MultiSoundMain from "@/components/multi/MultiSoundMain.vue";
import MultiAnalizeMain from "@/components/multi/MultiAnalizeMain.vue";

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
    },
    data() {
        return {
            OV: undefined,
            session: undefined,
            publisher: undefined,
            roomCode: '',
            audioEnabled: true,
            videoEnabled: true,
            subscribers: [],
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
        }   
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
        startButtonConfirm: function() {
            this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'start-game'
                })
                .then(() => {
                    console.log('game start!');
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
            if (this.readyButtonOn) {
                // 준비 버튼이 활성화가 되어 있는 경우
                this.readyButtonOn = false;
                this.count--;
                this.readyButton = "warning";

                this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'ready-minus'
                })
                .then(() => {
                    console.log('the count of ready state is decremented');
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

                this.publisher.session.signal({
                    data: "",
                    to: [],
                    type: 'ready-plus'
                })
                .then(() => {
                    console.log('the count of ready state is incremented');
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
                console.log('game-setting successfully sent');
            })
            .catch(error => {
                console.error(error);
            })
        },
        jsonNameRendering: function(data) {
            const { clientData } = JSON.parse(data);
            return clientData;
        },
        printSession: function() {
            console.log(this.session);
        },
        checkMounted: function() {
            this.roomCode = window.location.hash.slice(1);

            if (this.roomCode) {
                console.log("코드가 있다[방 들어오기 모드] ==> 해당 코드로 만들어진 방이 존재하는지 확인 필요");
                // 방 들어오기 모드
                // 해당 코드로 만들어진 방이 존재하는지 확인이 먼저 필요하다
                // 확인이 완료되면 joinRoom 진행
                // numOfVideo에 따라서 접근을 제한하자

                this.joinRoom();
            }
            else {
                console.log("코드가 없다[방 만들기 모드] ==> 코드 만들어서 방 생성");
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
        outUser(memberId) {
            const { connection } = memberId.stream;
            const { clientData } = JSON.parse(connection.data);
            this.publisher.session.signal({
                data: clientData,
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
                console.log('Message successfully sent');
                console.log(this.chatMessage)

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
            this.isPlayGame = false
            this.isPlaySong = false
            this.isPlaySound = false
        },
        goMultiAnalize() {
            this.isPlayGame = false
            this.isPlaySong = false
            this.isPlaySound = false
            this.analizeVisible = true
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
                    console.log("Owner 스트림 생성에 버튼 상태 변화가 감지되었다!!");
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
                    console.log("Owner 스트림 생성에 버튼 상태 변화가 감지되었다!!");
                    this.startButtonEnabled = true;
                    this.startButton = "primary";
                }
            })

            // 3-3) stream kicked out
            this.session.on("signal:out", async (event) => {
                let id = event.data;

                if (id == this.myUserName) {
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
            this.session.on('signal:ready-plus', () => {
                this.countReady++;
                if (this.countReady == this.subscribers.length) {
                    // 추가
                    this.startButtonEnabled = true;
                    this.startButton = "primary";
                }

                console.log("owner에서 ready-plus를 받았다: ", this.countReady);
                console.log("현재 subscribers의 수: ", this.subscribers.length);
            })
            

            // 3-8) ready minus
            this.session.on('signal:ready-minus', () => {
                this.countReady--;
                this.startButtonEnabled = false;
                this.startButton = "danger";

                console.log("owner에서 ready-minus를 받았다: ", this.countReady);
                console.log("현재 subscribers의 수: ", this.subscribers.length);
            })

            // 3-9) start game
            this.session.on('signal:start-game', () => {
                this.startGame();
            })
        



            // 4) Get a token from the OpenVidu deployment
            this.getToken(this.roomCode).then((token) => {
                this.session.connect(token, { clientData: this.myUserName, isOwner: true })
                    .then(() => {
                        let path = (location.pathname.slice(-1) == "/" ? location.pathname : location.pathname + "/");
                        window.history.pushState("", "", path + "#" + this.roomCode);

                        // 대기방 뷰로 변화
                        // initializeSessionView()

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


                        // console.log("현재 session에 접속한 인원 수: " + this.session.connection.localOptions.value.length);
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

                if (id == this.myUserName) {
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
            })
        

            // 4) Get a token from the OpenVidu deployment
            this.getToken(this.roomCode).then((token) => {
                this.session.connect(token, { clientData: this.myUserName, isOwner: false })
                    .then(() => {
                        let path = (location.pathname.slice(-1) == "/" ? location.pathname : location.pathname + "/");
                        window.history.pushState("", "", path + "#" + this.roomCode);

                        // 대기방 뷰로 변화
                        // initializeSessionView()

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


                        // console.log("현재 session에 접속한 인원 수: " + this.session.connection.localOptions.value.length);
                        // 최대 정원 4명으로 설정
                        // let numOfJoined = this.session.connection.localOptions.value.length;
                        // console.log("방에 접속한 현재 인원: " + numOfJoined);
                        // if (numOfJoined >= 4) {
                        //     alert("정원초과");
                        //     this.leaveSession();
                        //     return;
                        // }
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
    border: 5px solid gray;
    margin: 0;
    padding: 0;
    width: 85%;
    
  }
  #YellowBoxVideo{
    border: 5px solid yellow;
    display: flex;
    width:99%;
    height:65%;
    margin: 0;
    padding: 0;
  }
  #GreenBoxChat{
    border: 2px solid green;
    display: inline-block;
    width: 98.5%; 
    height: 160px;
    margin: 0; 
    padding: 0;
    
  }
  #OrangeBoxStart{
    border: 5px solid orange;
    display: inline-block;
    width: 400px; 
    height: 180px;
    margin-top: 3px;
    margin-right: 10px;
    float: right;
  }

  #RightBox{
    border: 5px solid hotpink;
    margin: 0;
    padding: 0;
    width: 15%;
  }
  #PurpleBoxGameSetting{
    border : 5px solid purple;
    padding: 0;
    margin: 0;
    height: 25%;
  }
  #BlueBoxUserList{
    margin: 0;
    padding: 0;
    border: 5px solid blue;
    height: 63%;
  }
  #RedBoxRightBottom{
    margin: 0;
    padding: 0;
    border: 5px solid red;
    display: flex;
    justify-content: space-between;
  }

  /* User List Scrollbar*/
  .user-scrollbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 5px #333;
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
</style>