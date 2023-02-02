<template>
<div class="container">
    <el-row class="game-main-container">
        <el-col :span="22" class="game-main-note">
            문제 나오는 부분
        </el-col>
    </el-row>
    <el-row class="game-sub-container">
        <el-col :span="15" class="game-sub-my-cam">
            <user-video :stream-manager="mainStreamManager"/>
        </el-col>
        <el-col :span="8" :offset="1" class="game-sub-info">
            <div class="game-sub-title font">비 행 기</div>
            <div class="game-sub-img">
                <!-- 곡 이미지 배경 -->
                <div class="game-sub-song-info">
                    <h3 class="produce font">작곡가 : Sarah Josepha Hale & John Roulstone</h3><br>
                    <h3 class="produce font">작사가 : 윤석중</h3><br>
                    <!--곡 설명-->
                    <h3 class="descTitle font">[곡 설명]</h3>
                    <p class="description font">세 개의 음 도, 레, 미의 3음계로 되어있으며,<br>배우기 쉬운 노래이다.</p>
                </div>
            </div>
            <div class="game-sub-button">
                <el-button class="solo-analyze-button" @click="goSoloAnalize">분석</el-button>
                <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
            </div>
        </el-col>
    </el-row>
</div>
</template>
<script>
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "@/components/video/solo/soloSongUserVideo.vue"
import { mapActions } from 'vuex'

axios.defaults.headers.post["Content-Type"] = "application/json";

const APPLICATION_SERVER_URL = "http://localhost:5000/";

export default {
    name: 'SoloSongMain',
    components: {
        UserVideo,
    },

    computed: {
        isSession() {
            if (this.$store.state.mySessionId !== '') {
                return this.$store.state.mySessionId
            } else {
                return 'SessionA'
            }
        }
    },
    data() {
        return {
            // OpenVidu Object
            OV: undefined,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],

            // Join form
            mySessionId: "SessionA",
            myUserName: "Participant" + Math.floor(Math.random() * 100),
        }
    },
    methods: {
        goSoloAnalize() {
            this.$router.push({ name: 'soloAnalize' })
        },
        goSolo() {
            this.$router.push({ name: 'solo' })
        },
        
        ...mapActions(['initMySessionId']),

        joinSession() {
            // 1. OpenVidu 객체 가져오기
            this.OV = new OpenVidu();
            
            // 2. 세션 시작
            this.session = this.OV.initSession();

            // 3. 세션에서 일어나는 이벤트 
            // 3-1. 새로운 스트림 생성시 사용자 등록
            this.session.on("streamCreated", ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber);
            });

            // 3-2. 스트림 말소시 사용자 제외
            this.session.on("streamDestroyed", ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                this.subscribers.splice(index, 1);
                }
            })

            // 3-3. 예외 발생 시
            this.session.on("exception", ({ exception }) => {
                console.warn(exception);
            })

            // 4. 유효한 사용자 토큰과 세션에 접속하기
            this.getToken(this.$store.state.mySessionId).then((token) => {
                this.session.connect(token, { clientData: this.$store.state.myUserName })
                .then(() => {

                    // 5. 카메라 설정
                    let publisher = this.OV.initPublisher(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    // ratio: 16/9,
                    resolution: "240x160",
                    framerate: 30,
                    insertMode: "Append",
                    mirror: false,
                    });

                    this.mainStreamManager = publisher;
                    this.publisher = publisher;

                    // 6. 스트림 퍼블리시
                    this.session.publish(this.publisher);
                })
                .catch((error) => {
                    console.log("ERROR: ", error.code, error.message);
                });
            });

            window.addEventListener("beforeunload", this.leaveSession);
        }, //joinSession 함수 끝

        leaveSession() {
            // 세션 종료
            if (this.session) this.session.disconnect();

            // 모든 요소 초기화
            this.session = undefined;
            this.mainStreamManager = undefined;
            this.publisher = undefined;
            this.subscribers = [];
            this.OV = undefined;

            this.initMySessionId(); // 세션 초기화, 닉네임은 유지
            window.removeEventListener("beforeunload", this.leaveSession);
            this.$router.push({ name: 'mode' }) // 모드 선택으로 이동
        },

        updateMainVideoStreamManager(stream) {
            // 메인 비디오 적용
            if (this.mainStreamManager === stream) return;
            this.mainStreamManager = stream;
        },

        async getToken(mySessionId) {
            const sessionId = await this.createSession(mySessionId);
            return await this.createToken(sessionId);
        },

        async createSession(sessionId) {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId },{
                headers: { 'Content-Type': 'application/json', },
            });
            return response.data;
        },


        async createToken(sessionId) {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        }

    },
    mounted() {
        this.joinSession()
    }
}
</script>

<style>
.container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.game-main-container{
    border: 1px solid green;
    height: 20%;
    width: 95%;
    margin-bottom: 10px;
    border-radius: 3%;
}

.game-sub-container{
    height: 70%;
    width : 95%;
}

.game-sub-my-cam{
    height: 100%;
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 3%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.game-sub-info{
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 3%;
    height: 100%;
}
.game-sub-title{
    font-size: 5vh;
    color: white;
    margin-top: 3vh;
    margin-bottom: 10px;
}
.game-sub-img{
    width: 90%;
    height: 60%;
    margin: auto;
    aspect-ratio: 4 / 3;
    background-image: url("../../assets/game/song/airplane.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
}
.game-sub-button{
    margin-top: 5vh;
}
.game-sub-song-info{
    height: 50%;
    width: 70%;
    /* background-image: url("../../assets/game/song/airplane.png");
    background-repeat: no-repeat;
    background-size: 100% 100%; */
    border-radius: 3%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.produce {
    margin-bottom: 0;
    margin-top: 3px;
    font-size: 3vh;
    /* color: rgb(236, 236, 128) */

}
.descTitle{
    margin-top:0;
    margin-bottom: 0;
    font-size: 3vh;
}
.description{
    margin-top: 0;
    margin-bottom:0;
    font-size: 2vh;
}

</style>