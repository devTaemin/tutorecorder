<template>
    <div class="container">
        <el-row class="game-main-container">
            <el-col :span="22" class="game-main-note">
                문제 나오는 부분
            </el-col>
        </el-row>
        <el-row class="game-sub-container">
            <el-col :span="15" class="game-sub-cam-section">
                <el-col :span="6" class="game-content-others-cam">
                    <el-button class="carousel-button" :icon="ArrowUpBold" @click="goPrev"></el-button>
                    <div class="carousel" id="cam-carousel">
                        <div v-for="sub in subscribers" :key="sub" class="caroursel-item-song">
                            <user-video :stream-manager="sub" />
                        </div>
                    </div>
                    <el-button class="carousel-button" :icon="ArrowDownBold" @click="goNext"></el-button>
                </el-col>
                <el-col :span="17" class="game-content-my-cam">
                    <user-video :stream-manager="publisher"/>
                </el-col>
            </el-col>
            <el-col :span="8" :offset="1" class="game-sub-info">
                <div class="game-sub-title">곡 제목</div>
                <div class="game-sub-img">
                    <!-- 곡 이미지 들어갈 곳 -->
                </div>
                <div class="game-sub-button">
                    <el-button :class="{'solo-analyze-button': true, 'is-owner': !isOwner}" @click="goMultiAnalize">분석</el-button>
                    <el-button class="solo-out-button" @click="goRoom">방으로</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
// import { OpenVidu } from "openvidu-browser";
// import axios from "axios";
import UserVideo from "@/components/video/soloUserVideo.vue"
// import { mapActions } from 'vuex'

// const APPLICATION_SERVER_URL = "http://localhost:5000/";
// const APPLICATION_SERVER_URL = "https://i8c206.p.ssafy.io/";

export default {
    name: 'MultiSongMain',
    components: {
        UserVideo,
    },
    props: {
        publisher: Object,
        subscribers: Array,
        isOwner: Boolean,
    },
    data() {
        return {
            // icon
            ArrowUpBold: ArrowUpBold,
            ArrowDownBold: ArrowDownBold,

            // openvidu object
            OV: undefined,
            session: undefined,
            // mainStreamManager: undefined,
            // publisher: undefined,
            // subscribers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

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
        goRoom() {
            if (this.isOwner === true) {
                this.$emit('goRoom')
            } else {
                this.$emit('goRoomAlone')
            }

        },
        goNext() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop += height; 
        },
        goPrev() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop -= height; 
        },

        // openVidu
        // ...mapActions(['initMySessionId']),

        // joinSession() {
        //     // 1. OpenVidu 객체 가져오기
        //     this.OV = new OpenVidu();
            
        //     // 2. 세션 시작
        //     this.session = this.OV.initSession();

        //     // 3. 세션에서 일어나는 이벤트 
        //     // 3-1. 새로운 스트림 생성시 사용자 등록
        //     this.session.on("streamCreated", ({ stream }) => {
        //         const subscriber = this.session.subscribe(stream);
        //         this.subscribers.push(subscriber);
        //     });

        //     // 3-2. 스트림 말소시 사용자 제외
        //     this.session.on("streamDestroyed", ({ stream }) => {
        //         const index = this.subscribers.indexOf(stream.streamManager, 0);
        //         if (index >= 0) {
        //         this.subscribers.splice(index, 1);
        //         }
        //     })

        //     // 3-3. 예외 발생 시
        //     this.session.on("exception", ({ exception }) => {
        //         console.warn(exception);
        //     })

        //     // 4. 유효한 사용자 토큰과 세션에 접속하기
        //     this.getToken(this.$store.state.mySessionId).then((token) => {
        //         this.session.connect(token, { clientData: this.$store.state.myUserName })
        //         .then(() => {

        //             // 5. 카메라 설정
        //             let publisher = this.OV.initPublisher(undefined, {
        //             audioSource: undefined,
        //             videoSource: undefined,
        //             publishAudio: true,
        //             publishVideo: true,
        //             // ratio: 16/9,
        //             resolution: "240x160",
        //             framerate: 30,
        //             insertMode: "Append",
        //             mirror: false,
        //             });

        //             this.mainStreamManager = publisher;
        //             this.publisher = publisher;

        //             // 6. 스트림 퍼블리시
        //             this.session.publish(this.publisher);
        //         })
        //         .catch((error) => {
        //             console.log("ERROR: ", error.code, error.message);
        //         });
        //     });

        //     window.addEventListener("beforeunload", this.leaveSession);
        // }, //joinSession 함수 끝

        // leaveSession() {
        //     // 세션 종료
        //     if (this.session) this.session.disconnect();

        //     // 모든 요소 초기화
        //     this.session = undefined;
        //     this.mainStreamManager = undefined;
        //     this.publisher = undefined;
        //     this.subscribers = [];
        //     this.OV = undefined;

        //     this.initMySessionId(); // 세션 초기화, 닉네임은 유지
        //     window.removeEventListener("beforeunload", this.leaveSession);
        //     this.$router.push({ name: 'mode' }) // 모드 선택으로 이동
        // },

    //     updateMainVideoStreamManager(stream) {
    //         // 메인 비디오 적용
    //         if (this.mainStreamManager === stream) return;
    //         this.mainStreamManager = stream;
    //     },

    //     async getToken(mySessionId) {
    //         const sessionId = await this.createSession(mySessionId);
    //         return await this.createToken(sessionId);
    //     },

    //     async createSession(sessionId) {
    //         const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId },{
    //             headers: { 'Content-Type': 'application/json', },
    //         });
    //         return response.data;
    //     },


    //     async createToken(sessionId) {
    //         const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //         return response.data;
    //     }
    // },
    // mounted() {
    //     this.joinSession()
    // }
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
    border-radius: 20px;
}

.game-sub-container{
    height: 70%;
    width : 95%;
}

.game-sub-cam-section{
    height: 100%;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.374);
    height: 100%;
    display: flex;
    justify-content: space-between;
}

.game-sub-info{
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 20px;
    height: 100%;
}
.game-sub-title{
    font-size: 2rem;
    margin-top: 3vh;
    margin-bottom: 10px;
}
.game-sub-img{
    width: 90%;
    margin: 0 auto;
    aspect-ratio: 4 / 3;
    background-image: url("../../assets/board.png");
    background-size: contain;
    background-repeat: no-repeat;
}

.game-sub-button{
    margin-top: 5vh;
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
.carousel-button {
    width: 3vw;
    background-color: #F0CDCD;
    color: #6A6D71;
    margin-top: 1vh;
    margin-bottom: 1vh;
    cursor: url(../../assets/cursor_click.png), auto !important;
}
#cam-carousel{
    width: 100%;
    height: 87%;
    overflow-y: auto;
    scroll-behavior: smooth;
}
#cam-carousel::-webkit-scrollbar{
    display:none;
}
.caroursel-item-song {
    height: 24.7%;
    width: 99.5%;
    background-color: #9fa1a4;
    overflow: hidden;
    border: 1px solid black;
    border-radius: 10px;
}

.is-owner{
    display: none;
}
</style>