<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-cam-section">
            <el-col :span="6" class="game-content-others-cam">
                <el-button class="carousel-button" :icon="ArrowUpBold" @click="goPrev"></el-button>
                <div class="carousel" id="cam-carousel">
                    <div v-for="subscriber in subscribers" :key="subscriber" class="caroursel-item">
                        <h3>{{ subscriber }}</h3>
                    </div>
                </div>
                <el-button class="carousel-button" :icon="ArrowDownBold" @click="goNext"></el-button>
            </el-col>
            <el-col :span="17" class="game-content-my-cam">
                <user-video :stream-manager="mainStreamManager"/>
            </el-col>
        </el-col>
        <el-col :span="8" class="game-content-info">
            <div class="game-content-title">소리내기</div>
            <div class="game-content-target">
                <img id="board-image" src="../../assets/board.png" alt="">
            </div>
            <div class="game-content-button">
                <el-button class="solo-analyze-button" @click="goMultiAnalize">분석</el-button>
                <el-button class="solo-out-button" @click="goMulti">나가기</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "@/components/video/soloUserVideo.vue"
import { mapActions } from 'vuex'

const APPLICATION_SERVER_URL = "http://localhost:5000/";

export default {
    name: 'MultiSoundMain',
    components: {
        UserVideo,
    },
    props: {
        
    },
    data() {
        return {
            // icon
            ArrowUpBold: ArrowUpBold,
            ArrowDownBold: ArrowDownBold,

            // openvidu object
            OV: undefined,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

            
            // Join form
            mySessionId: "SessionA",
            myUserName: "Participant" + Math.floor(Math.random() * 100),
        }
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
    methods: {
        goMultiAnalize() {
            this.$emit('goMultiAnalize')
        },  
        // goMulti() {
        //     this.$router.push({ name: 'MultiRoom' })
        // }
        goNext() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop += height; 
        },
        goPrev() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop -= height; 
        },
        // openVidu
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
.game-content-container{
    height: 100%;
}

.game-content-cam-section{
    margin: auto;
    height: 95%;
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
}
.game-content-others-cam{
    margin: auto;
    height: 100%;
    border: 1px solid orange;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.game-content-my-cam {
    margin: auto;
    height: 100%;
    border: 1px solid orange;
    border-radius: 20px;
}

.game-content-info{
    background-color: rgba(0, 0, 0, 0.374);
    height: 95%;
    margin-top: auto;
    margin-bottom: auto;
    border-radius: 20px;
    margin-right: 10px;
}

.game-content-target{
    height: 50%;
    width: 90%;
    margin: 0px auto;
}

.game-content-button{
    margin-top: 13vh;
}

#board-image{
    width: 100%;
    height: 100%;
}

.game-content-title{
    margin-top: 5vh;
    font-size: 7vh;
    margin-bottom: 5vh;
}
.carousel-button {
    width: 3vw;
    background-color: #F0CDCD;
    color: #6A6D71;
    cursor: url(../../assets/cursor_click.png), auto !important;
}
#cam-carousel{
    width: 100%;
    height: 87%;
    margin-top: 5px;
    margin-bottom: 5px;
    overflow-y: auto;
    scroll-behavior: smooth;
}
#cam-carousel::-webkit-scrollbar{
    display:none;
}
.caroursel-item {
    height: 24.7%;
    width: 99.5%;
    background-color: #9fa1a4;
    overflow: hidden;
    border: 1px solid black;
    border-radius: 10px;
}
</style>