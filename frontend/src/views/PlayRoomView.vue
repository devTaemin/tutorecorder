<template>
    <div>
        플레이룸
        <el-button type="danger" plain @click="leaveSession">Leave a Session</el-button>
        <br/>
        <br/>
        <br/>
        <br/>

        <div v-if="isOwner">관리자입니다.</div>
        <div v-if="!isOwner">참여자입니다.</div>
        <el-button type="success" plain @click="printSession">세션 정보 프린트</el-button>
        <br/>
        <br/>
        <br/>
        <br/>

        <div>참가자 목록입니다</div>
        <div>{{ this.myUserName }}</div>
        <div v-if="this.isOwner">
            <div id="players" v-for="sub in subscribers" :key="sub.stream.connection.connectionId" @click="outUser(sub)">
                {{ jsonNameRendering(sub.stream.connection.data) }}
            </div>
        </div>
        <div v-if="!this.isOwner">
            <div id="players" v-for="sub in subscribers" :key="sub.stream.connection.connectionId">
                {{ jsonNameRendering(sub.stream.connection.data) }}
            </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>


        <div>비디오 입니다</div>
        <div id="session" v-if="session">
            <div id="video-container">
                <user-video :stream-manager="publisher"/>
                <user-video v-for="sub in subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" />
            </div>
        </div>


    </div>
</template>
<script>
import { OpenVidu } from "openvidu-browser";
import { mapState } from "vuex"
import axios from "axios";
import UserVideo from "@/components/video/UserVideo.vue"

axios.defaults.headers.post["Content-Type"] = "application/json";

const APPLICATION_SERVER_URL = "http://localhost:5000/";

export default {
    name: 'PlayRoomView',
    components: {
        UserVideo,
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
            isOwner: false
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

            console.log("------------------세션정보------------------");
            console.log(this.session);
            console.log("-------------------------------------------");
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
           
            window.location.href = window.location.origin + '/mode';
        },
        outUser(memberId) {
            console.log("------------ sub 정보 debug ------------");
            console.log(memberId);
            //sub.stream.connection.connectionId
            console.log(memberId.stream);
            console.log(memberId.stream.connection);
            console.log(memberId.stream.connection.connectionId);
            console.log("----------------------------------------");
            const { connection } = memberId.stream;
            const { clientData } = JSON.parse(connection.data);
            this.publisher.session.signal({
                data: clientData,
                to: [],
                type: "out"
            });
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
                    alert("세션에서 추방당하셨습니다.");
                    return;
                }
            })

            // 3-4) exception
            this.session.on("exception", ({ exception }) => {
                console.warn(exception);
            })
        
            console.log("3");


            // 4) Get a token from the OpenVidu deployment
            this.getToken(this.roomCode).then((token) => {
                this.session.connect(token, { clientData: this.myUserName, isOwner: true })
                    .then(() => {
                        console.log("4");
                        let path = (location.pathname.slice(-1) == "/" ? location.pathname : location.pathname + "/");
                        window.history.pushState("", "", path + "#" + this.roomCode);

                        // 대기방 뷰로 변화
                        // initializeSessionView()

                        let publisher = this.OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            resolution: "640x480",
                            frameRate: 30,
                            insertMode: "Append",
                            mirror: false,
                        });

                        this.publisher = publisher;
                        console.log("5");

                        this.session.publish(this.publisher);
                        console.log("6");


                        // console.log("현재 session에 접속한 인원 수: " + this.session.connection.localOptions.value.length);
                        // 최대 정원 4명으로 설정

                        // Owner 설정
                        this.isOwner = true;
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
            console.log("1");

            // 2) Init a Session
            this.session = this.OV.initSession();
            console.log("2");

            // 3) Spcify the actions when events take place in the session
            // 3-1) streamCreated
            this.session.on('streamCreated', ({ stream }) => {
                console.log("들어가는 스트림 확인");
                console.log(stream);
                                console.log(stream.connection.data);

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
        
            console.log("3");

            // 4) Get a token from the OpenVidu deployment
            this.getToken(this.roomCode).then((token) => {
                this.session.connect(token, { clientData: this.myUserName, isOwner: false })
                    .then(() => {
                        console.log("4");
                        let path = (location.pathname.slice(-1) == "/" ? location.pathname : location.pathname + "/");
                        window.history.pushState("", "", path + "#" + this.roomCode);

                        // 대기방 뷰로 변화
                        // initializeSessionView()

                        let publisher = this.OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            resolution: "640x480",
                            frameRate: 30,
                            insertMode: "Append",
                            mirror: false,
                        });

                        this.publisher = publisher;
                        console.log("5");

                        this.session.publish(this.publisher);
                        console.log("6");


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