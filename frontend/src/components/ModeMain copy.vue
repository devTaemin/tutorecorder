<template>
    <div>
        <h1>{{ msg }}</h1>
        <div v-if="!session">
            <el-row :gutter="18" justify="center">
                <el-col :span="6">
                    <el-card shadow="hover" @click="moveSoloPage">
                        <div>혼자하기</div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" @click="roomEnterVisible=true">
                        <div>방들어가기</div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" @click="roomMakeVisible=true">
                        <div>방만들기</div>
                    </el-card>
                </el-col>
            </el-row>

            <el-dialog
                v-model="roomEnterVisible"
                title=""
                width="40%"
            >
                <el-form
                    label-width="100px"
                    style="max-width:500px"
                >
                    <el-form-item label="방 코드 입력">
                        <el-input v-model="roomCode" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="roomEnterVisible=false">취소</el-button>
                    <el-button type="success" @click="enterRoom">입장</el-button>
                </template>
            </el-dialog>

            <el-dialog
                v-model="roomMakeVisible"
                title=""
                width="40%"
            >
                <el-form
                    label-width="100px"
                    style="max-width:500px"
                >
                    <el-form-item label="방 코드 설정">
                        <el-input v-model="roomCode" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="roomMakeVisible=false">취소</el-button>
                    <el-button type="success" @click="createRoom">생성</el-button>
                </template>
            </el-dialog>
        </div>


        <div id="session" v-if="session">
            <div id="session-header">
            <h1 id="session-title">{{ this.$store.getters.getMySessionId }}</h1>
            <input type="button" id="buttonLeaveSession" @click="leaveSession" value="Leave session" />
            </div>
            <div id="main-video">
            <user-video :stream-manager="mainStreamManager"/>
            </div>
            <div id="video-container">
            <user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)"/>
            <user-video v-for="sub in subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
            </div>
        </div>
    </div>
</template>
<script>
// import { mapState, mapActions } from 'vuex'
import { OpenVidu } from 'openvidu-browser'
import axios from 'axios'
import UserVideo from './video/UserVideo.vue';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const APPLICATION_SERVER_URL = 'http://localhost:5000/';

export default {
    name: 'ModeMain',
    props: {
        msg: String,
    },
    components: {
        UserVideo
    },
    data() {
        return {
            roomEnterVisible: false,
            roomMakeVisible: false,
            roomCode: '',


            OV: undefined,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
        }
    },
    computed: {
        // ...mapState(['myUserName', 'mySessionId', 'OV', 'session', 'mainStreamManager', 'publisher', 'subscribers']),

    },
    methods: {
        // ...mapActions(['initMySessionId', 'setMySessionId']),

        moveSoloPage: function() {
            this.$router.push({ name: 'solo' })
        },
        enterRoom: function() {
            this.$store.commit('SET_MY_SESSION_ID', this.roomCode);
            this.joinSession();
            console.log("방 입장");
            this.roomCode='';
            this.roomEnterVisible=false;
        },
        createRoom: function() {
            this.$store.commit('SET_MY_SESSION_ID', this.roomCode);
            this.joinSession();
            console.log("방 생성");
            this.roomCode='';
            this.roomMakeVisible=false;

            // DEBUG
        },
        joinSession() {
            // 1) OpenVidu 객체 생성
            this.OV = new OpenVidu();
            console.log("1 통과");

            // 2) session 초기화
            this.session = this.OV.initSession();
            console.log("2 통과");

            // 3) 세션 이벤트 정의 (this.$store.getters.getSession)
            this.session.on("streamCreated", ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber);

            })

            this.session.on("streamDestroyed", ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }
            })

            this.session.on("exception", ({ exception }) => {
                console.warn(exception);
            })

            console.log("3 통과");

            // 4) 유효한 사용자 토큰으로 세션에 접속
            this.getToken(this.$store.getters.getMySessionId).then((token) => {
                this.session.connect(token, { clientData: this.$store.getters.getMyUserName })
                    .then(() => {
                        console.log("4 통과");

                        // 5) 카메라 세팅
                        let publisher = this.OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: undefined,
                            publishVideo: undefined,
                            resolution: "640x480",
                            frameRate: 30,
                            insertMode: "APPEND",
                            mirror: false,
                        });

                        this.mainStreamManager = publisher;
                        this.publisher = publisher;
                        console.log("5 통과");

                        // 6) stream 퍼블리시
                        this.session.publish(this.publisher);
                        console.log("6 통과");                        
                    })
            })
            .catch((error) => {
                console.log("There was an error connecting to the session:", error.code, error.message);
            })

            window.addEventListener("beforeunload", this.leaveSession);
        },
        leaveSession() {
            if (this.session) this.session.disconnect();

            this.session = undefined;
            this.mainStreamManager = undefined;
            this.publisher = undefined;
            this.subscribers = undefined;
            this.OV = undefined;
            this.$store.commit('INIT_SESSION');
            this.$store.commit('INIT_MAIN_STREAM_MANAGER');
            this.$store.commit('INIT_PUBLISHER');
            this.$store.commit('INIT_SUBSCRIBERS');
            this.$store.commit('INIT_OV');
            
            window.removeEventListener("beforeunload", this.leaveSession);
        },
        updateMainVideoStreamManager(stream) {
            if (this.mainStreamManager === stream) return;
            this.mainStreamManager = stream;
        },
        async getToken(mySessionId) {
            const sessionId = await this.createSession(mySessionId);
            return await this.createToken(sessionId);
        },
        async createSession(sessionId) {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', 
            { customSessionId: sessionId }, { headers: { 'Content-Type': 'application/json' }});

            return response.data;   // Session ID
        },
        async createToken(sessionId) {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
            {}, { headers: { 'Content-Type': 'application/json' }});

            return response.data;   // Token
        }
    }
}
</script>