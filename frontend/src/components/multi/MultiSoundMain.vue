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
                <img id="board-image" src="../../assets/board.png">
                <span class="pitch-target" style="margin-top:">{{ pitch_target }}</span>
                <span id="solo-sound-timer">{{ timer }}</span>
                <span id="problem">{{ problem }}</span>
            </div>
            <div class="button-container">
                <div class="option-container">
                    <el-button :class="{ 'solo-analyze-button': !playGameAnalize, 'solo-analyze-button-playgame': playGameAnalize }" :disabled="playGameAnalize" @click="goMultiAnalize">분석</el-button>
                    <el-button class="solo-out-button" @click="goRoom">나가기</el-button>
                </div>
                <div class="solo-start-button-container">
                    <el-button :class="{ 'solo-start-button': !playGame, 'solo-start-button-playgame': playGame }" :disabled="playGame" @click="gameStart(); init()">{{ gameState }}</el-button>
                </div>
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
import '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'

// const APPLICATION_SERVER_URL = "http://localhost:5000/";
const APPLICATION_SERVER_URL = "https://i8c206.p.ssafy.io/";

let pitch_list = ['도', '레', '미', '파', '솔', '라', '시'];
const pitch_list2 = ['도', '레', '미', '파', '솔', '라', '시'];


// pick_list에 나올 음계 저장
// 최소 한 번씩 나오게 하는 구간
let pick_list
// for (let i=0; i<7; i++) {
//     const pick_index = Math.floor(Math.random() * pitch_list.length);
//     pick_list.push(pitch_list[pick_index]);
//     pitch_list.splice(pick_index, 1);
// }
// 최소 한 번씩 나오게 하는 구간 끝

const problem = 3
// // 랜덤으로 problem개 더 출력
// for (let i=0; i<problem; i++) {
//     pick_list.push(pitch_list2[Math.floor(Math.random() * 7)]);
// }

// pick_list.push('참 잘했어요')
const total_problem = problem + 9;
const URL = "https://teachablemachine.withgoogle.com/models/eptQYA8MT/";

// 음계 측정값 넣을 리스트 - 현재 7개의 음과 배경소음만 있고 나중에 삑사리 추가
let grade_list = [[], [], [], [], [], [], []];


axios.defaults.headers.post["Content-Type"] = "application/json";


// 타이머 텍스트 색상
let color = 180; 

export default {
    name: 'MultiSoundMain',
    components: {
        UserVideo,
    },
    props: {
        difficulty: String,
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

            // 게임에 필요
            pitch_target: '',
            timer: '',
            gameState: '게임 시작!',
            playGame: false,
            problem: '',
            
            // playGameAnalize: true,
            playGameAnalize: false,
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
        ...mapActions(['saveGameResult', 'initMySessionId', 'initGameResult']),

        goMultiAnalize() {
            this.$emit('goMultiAnalize')
        },
        goRoom() {
            this.startTimer().timer
            this.$emit('goRoom')
        },
        goNext() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop += height; 
        },
        goPrev() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop -= height; 
        },

        // 게임에 필요한 스크립트
        async createModel () {

            
            const checkpointURL = URL + 'model.json' // model topology
            const metadataURL = URL + 'metadata.json' // model metadata

            const recognizer = speechCommands.create(
                'BROWSER_FFT', // fourier transform type, not useful to change
                undefined, // speech commands vocabulary feature, not useful for your models
                checkpointURL,
                metadataURL
            )

            // check that model and metadata are loaded via HTTPS requests.
            await recognizer.ensureModelLoaded()

            return recognizer
        },
        async init () {
            const recognizer = await this.createModel() // 모델 생성
            const classLabels = recognizer.wordLabels() // get class labels, 학습 시킨 클래스들
            // 실시간으로 계이름 전체 점수 표시해주는 역할(필요없어서 지움)
            // const labelContainer = document.getElementById('label-container') // 데이터 라벨 생성
            // for (let i = 0; i < classLabels.length; i++) {
            //     labelContainer.appendChild(document.createElement('div'))
            // }

            // listen() takes two arguments:
            // 1. A callback function that is invoked anytime a word is recognized.
            // 2. A configuration object with adjustable fields
            recognizer.listen(result => {
                const scores = result.scores // eslint-disable-line no-unused-vars
                // render the probability scores per class
                for (let i = 0; i < classLabels.length; i++) {
                    // const classPrediction = classLabels[i] + ': ' + result.scores[i].toFixed(2) // 소숫점까지 표기(2자리)
                    //   console.log('음계' + classLabels[i])
                    //   console.log('점수' + result.scores[i])
                    // 도, 레, 미, 파, 솔, 라, 시, 음이탈, 바람빠지는소리, 배경소음
                    const index = result.scores.indexOf(Math.max(...result.scores));
                    switch(this.pitch_target) {
                        case '도':
                            if (index === 0) {
                                grade_list[0].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[0].push(0)
                            }
                            break;
                        case '레':
                            if (index === 1) {
                                grade_list[1].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[1].push(0)
                            }
                            break;
                        case '미':
                            if (index === 2) {
                                grade_list[2].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[2].push(0)
                            }
                            break;
                        case '파':
                            if (index === 3) {
                                grade_list[3].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[3].push(0)
                            }
                            break;
                        case '솔':
                            if (index === 4) {
                                grade_list[4].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[4].push(0)
                            }
                            break;
                        case '라':
                            if (index === 5) {
                                grade_list[5].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[5].push(0)
                            }
                            break;
                        case '시':
                            if (index === 6) {
                                grade_list[6].push(result.scores[index])
                            } else if (index !== 9){
                                grade_list[6].push(0)
                            }
                            break;
                        default:
                            // code block for default case
                    }

                    // 실시간 전체 점수 표시해주는 역할(필요없어서 지움)
                    // labelContainer.childNodes[i].innerHTML = classPrediction
                }
            }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
            })

            // Stop the recognition in 5 seconds.
            // setTimeout(() => recognizer.stopListening(), 5000);
        },
        gameStart() {
            this.initGameResult()
            pitch_list = ['도', '레', '미', '파', '솔', '라', '시'];
            pick_list = ['시작!']
            // 랜덤으로 문제 10개 뽑음
            // 최소 한 번씩 나오도록 하는 부분
            for (let i=0; i<7; i++) {
                const pick_index = Math.floor(Math.random() * pitch_list.length);
                pick_list.push(pitch_list[pick_index]);
                pitch_list.splice(pick_index, 1);
            }
            // 랜덤으로 problem개 더 출력
            for (let i=0; i<problem; i++) {
                pick_list.push(pitch_list2[Math.floor(Math.random() * 7)]);
            }
            pick_list.push('참 잘했어요')

            this.playGameAnalize = true
            this.gameState = '게임 진행중...'
            this.playGame = true
            this.pitch_target = '준비하세요';
            let index = 0;
            grade_list = [[], [], [], [], [], [], []];
            let game = setInterval(() => {
                this.pitch_target = pick_list[index];
                // index에 몇 가지 나올지 저장
                index = (index + 1) % total_problem;
                if (index === 2) {
                    clearInterval(game);
                    this.startTimer();
                    this.timerRed();
                    this.problem = '1' + '/' + (total_problem - 2)
                    game = setInterval(() => {
                        this.problem = index + '/' + (total_problem - 2)
                        if (index > 10) {
                            this.problem = ''
                        }
                        this.pitch_target = pick_list[index];
                        index = (index + 1) % total_problem;
                        if (index === 0) {
                            clearInterval(game)
                            this.saveGameResult(grade_list)
                            this.gameState = '게임 시작!'
                            this.playGameAnalize = false
                            this.playGame = false
                        }
                    }, (this.difficulty * 1000))
                } 
            }, 2000)
        },
        startTimer() {
            this.timer = this.difficulty - 1;
            // count를 이용해서 문제 끝나면 타이머 사라지게 함
            let count = this.difficulty * 2
            let timer = setInterval(() => {
                this.timer -= 1;
                count += 1
                if (this.timer === -1) {
                    this.timer = this.difficulty - 1
                    color = 180;
                }
                if (count/this.difficulty === total_problem) {
                    clearInterval(timer)
                    this.timer = ''
                }
            }, 1000)
        },
        timerRed() {
            // 5초일때 -3.6, 4초일때 -4.5 , 3초일때 -6
            const timer = document.getElementById("solo-sound-timer");
            timer.style.color = `rgb(255, 180, 180)`;
            let count = 0
            const timerTextRed = setInterval(() => {
                color -= 18/this.difficulty;
                timer.style.color = `rgb(255, ${color}, ${color})`;
                if (color <= -10) {
                    count += 1;
                }
                if (count > total_problem-3) {
                    clearInterval(timerTextRed);
                }
            }, 100);
        },

        // OpenVidu

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
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.game-content-cam-section{
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
    border-radius: 20px;
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
.game-content-target{
    height: 50%;
    width: 90%;
    margin: 0px auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button-container{
    display: flex;
    flex-direction: column;
    align-items: center;
}

#board-image{
    width: 100%;
    height: 100%;
    
}

.game-content-title{
    margin-top: 5vh;
    font-size: 7vh;
    margin-bottom: 5vh;
    color: white;
    font-family: 'JUA', serif;
}

.pitch-target{
    position: absolute;
    font-size: 3vw;
    color: white;
    font-family: 'JUA', serif;
}

#solo-sound-timer{
    position: absolute;
    left: 10%;
    top: 15%;
    font-size: 5vh;
    font-family: 'JUA', serif;
}

.option-container{
    width: 100%;
    margin-top: 5%;
}

.solo-start-button-container{
    width: 100%;
    margin-top: 5%;
}

#problem{
    position: absolute;
    right: 10%;
    top: 15%;
    font-size: 5vh;
    color: white;
    font-family: 'JUA', serif;
}
</style>