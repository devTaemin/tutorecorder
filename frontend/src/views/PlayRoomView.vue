<template>
    <div id="pink-container">

        <!-- 왼쪽 박스 -->
        <div id="LeftBox">

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


            <!-- 대기방 채팅창 -->
            <div id="GreenBoxChat">
                <p>chat box</p>
                <!-- 채팅 내용 스크롤 기능으로 집어 넣기 -->
                <el-scrollbar>
                    <p v-for="message in messageList" :key="message" class="chat-scrollbar-item">
                        {{ message }}
                    </p>
                </el-scrollbar>

                <!-- 입력 부분-->
                <el-input v-model="chatMessage" clearable />
                <el-button type="success" @click="this.sendMessage">
                    Submit
                    <el-icon class="el-icon--right"><Upload /></el-icon>
                </el-button>
            </div>
            <!-- 대기방 채팅창 끝 -->


            <!-- 게임 시작/준비 전환 버튼 -->
            <!-- Question: 아래쪽을 전부 chatbox로 채우고 UserList아래 부분에 StartBox를 만들면 되지 않을까?
                           톱니바퀴, 화살표가 왜 필요한지 질문필요
            -->
            <div id="OrangeBoxStart"> 
                <p>start box</p>
            </div>
            <!-- 게임 시작/준비 전환 버튼 끝 -->

        </div>
        <!-- 왼쪽 박스 끝-->


        <!-- 오른쪽 박스 -->
        <div id="RightBox">

            <!-- 게임 세팅 창 -->
            <!-- 중요한 점은 외부에서 들어온 사람들에게 이 방의 설정을 뿌려줘야 한다
                 또한 처음 방이 생성되어 있을때 default로 값이 설정되어 있어야 한다 -->
            <!-- 왜 게임 정보를 다 올리는 거야? 연주하기 소리내기 구분한건 뭐고 연주 나뉘고 난이도 선택 나뉘고 이게 뭐야? 또 이걸 왜 다 보여줘
                 게임 입장할때 기본값 설정은 왜 안되어 있는데?  -->
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
                <h1>User List</h1>
                <!-- 방장인 경우 참가자 확인 및 추방 기능을 추가한다 -->
                <div v-if="this.isOwner">
                    <el-scrollbar height="400px">
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
                    <el-scrollbar height="400px">
                        <div class="user-scrollbar-item">{{ this.myUserName }}</div>
                        <div class="user-scrollbar-item" v-for="sub in subscribers" :key="sub.stream.connection.connectionId">
                            {{ jsonNameRendering(sub.stream.connection.data) }} 
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <!-- 사용자 리스트 끝 -->


            <div id="RedBoxRightBottom">
                <img src="../assets/confsetting.png" 
                    alt="configuration setting img" 
                    @click="SettingVisible=true" 
                    style="cursor:pointer; width: 45px;"
                >
                <img src="../assets/goback.png" 
                    alt="game setting img" 
                    @click="leaveSession" 
                    style="cursor:pointer; 
                    width: 45px; "
                >
            </div>
        </div>
        <!-- 오른쪽 박스 끝 -->

        <!-- 게임설정 모달 창 -->
        <!-- Question: 게임 설정과 관련해서 각각 선택에 따라 어떤게 나오는지 질문 -->
        <el-dialog 
            v-model="gameSettingVisible" 
            title="" 
            width="40%" 
            style="border-radius: 10px"
            background-color= "#DFE4F6"
        >
            <span>
                <img src="../assets/gamesetting.png" alt="game setting img in modal" style="width: 25px;">
                게임설정
            </span>
            <hr>

            <h1 style="border:5px solid red">게임선택</h1>
            <el-radio-group v-model="gameMode" class="ml-4">
                <el-radio label="play" size="large" border="true" @click="this.choosePlay">연주하기</el-radio>
                <el-radio label="sound" size="large" border @click="this.chooseSound">소리내기</el-radio>
            </el-radio-group>
            <hr>

            <h1>곡 선택 - 곡 연주</h1>
            <el-radio-group v-model="basicSong" class="ml-4">
                <el-radio label="airplane" size="large" border :disabled="optionEnabler">비행기</el-radio>
                <el-radio label="anthem" size="large" border :disabled="optionEnabler">애국가</el-radio>
            </el-radio-group>
            <hr>

            <h1>난이도 선택 - 소리내기, 운지법</h1>
            <el-radio-group v-model="difficulty" class="ml-4">
                <el-radio label="level1" size="large" border :disabled="!optionEnabler">1단계(5초)</el-radio>
                <el-radio label="level2" size="large" border :disabled="!optionEnabler">2단계(3초)</el-radio>
                <el-radio label="level3" size="large" border :disabled="!optionEnabler">3단계(2초)</el-radio>
            </el-radio-group>
            <hr>
        
            <template #footer>
                <el-button type="success" @click="this.gameSettingConfirm">설정완료</el-button>
            </template>
        </el-dialog>
        <!-- 게임설정 모달 창 끝-->

        <!-- 환경설정 모달 창 -->
        <!-- 이 부분이 필요한가??? -->
        <el-dialog v-model="SettingVisible" width="20%" 
            style="border-radius: 10px; background-color: #DFE4F6;">
        <span>
            <img src="../assets/confsetting.png" alt="configuration setting img in modal" style="width: 45px;">
            환경설정
        </span>
        <hr>


        <h1 style="border:5px solid red">노래</h1>
        <div class="slider-demo-block">
            <el-slider v-model="MusicVolume" />
        </div>
        <hr>

        <h1>효과음</h1>
        <div class="slider-demo-block">
            <el-slider v-model="EffectVolume" />
        </div>
        <hr>

        <h1>카메라</h1>
        <el-radio-group v-model="Cam" class="ml-4">
            <el-radio label="1" size="large">켜기</el-radio>
            <el-radio label="2" size="large">끄기</el-radio>
        </el-radio-group>
        <hr>

        <h1>마이크</h1>
        <el-radio-group v-model="MiC" class="ml-4">
            <el-radio label="1" size="large">켜기</el-radio>
            <el-radio label="2" size="large">끄기</el-radio>
        </el-radio-group>
        <hr>
        
        <template #footer>
            <el-button type="success" @click="SettingVisible=false">설정완료</el-button>
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
import { Upload } from '@element-plus/icons-vue'

axios.defaults.headers.post["Content-Type"] = "application/json";

const APPLICATION_SERVER_URL = "http://localhost:5000/";

export default {
    name: 'PlayRoomView',
    components: {
        UserVideo,
        Upload,
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
            gameMode: undefined,
            basicSong: undefined,
            difficulty: undefined,
            chatMessage: '',
            messageList: [],
            optionEnabler: false,
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
            this.difficulty = "level1";
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
            })
            .catch(error => {
                console.error(error);
            })

            this.chatMessage = '';
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
                        // 최대 정원 4명으로 설정

                        // Owner 설정
                        this.isOwner = true;
                        
                        // Game 설정 (어떻게 고쳐야 하냐?)
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
                        let numOfJoined = this.session.connection.localOptions.value.length;
                        console.log("방에 접속한 현재 인원: " + numOfJoined);
                        if (numOfJoined >= 4) {
                            alert("정원초과");
                            this.leaveSession();
                            return;
                        }
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
        }
    }
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
    height:80%;
    margin: 0;
    padding: 0;
  }
  #GreenBoxChat{
    border: 5px solid green;
    display: inline-block;
    width: 85%;
    height: 15%; 
    margin: 0;
    padding: 0;
  } 
  #OrangeBoxStart{
    border: 5px solid orange;
    display: inline-block;
    width: 12%;
    height: 15%;
    margin: 0;
    padding: 0;
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
    height: 50px;
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
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 5px #333;
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

</style>