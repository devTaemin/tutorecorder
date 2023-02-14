<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-my-cam">
            <user-video :stream-manager="mainStreamManager"/>
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
                    <el-button :class="{ 'solo-analyze-button': !playGameAnalize, 'solo-analyze-button-playgame': playGameAnalize }" :disabled="playGameAnalize" @click="goSoloAnalize">분석</el-button>
                    <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
                </div>
                <div class="solo-start-button-container">
                    <el-button :class="{ 'solo-start-button': !playGame, 'solo-start-button-playgame': playGame }" :disabled="playGame" @click="gameStart(); init()">{{ gameState }}</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script type="text/javascript">
import '@tensorflow/tfjs'
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "@/components/video/soloUserVideo.vue"
import * as speechCommands from '@tensorflow-models/speech-commands'
import { mapActions } from 'vuex'


let pitch_list = ['도', '레', '미', '파', '솔', '라', '시'];
const pitch_list2 = ['도', '레', '미', '파', '솔', '라', '시'];
const problem = 3
const total_problem = problem + 9;
const URL = "https://teachablemachine.withgoogle.com/models/eptQYA8MT/";

// 음계 측정값 넣을 리스트 - 현재 7개의 음과 배경소음만 있고 나중에 삑사리 추가
let grade_list = [[], [], [], [], [], [], []];

axios.defaults.headers.post["Content-Type"] = "application/json";

const APPLICATION_SERVER_URL = "http://localhost:5000/";
// const APPLICATION_SERVER_URL = "https://i8c206.p.ssafy.io/";

// 타이머 텍스트 색상
let color = 180; 

export default {
    name: 'SoloSoundMain',
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

            //게임에 필요
            pitch_target: '',
            timer: '',
            gameState: '게임 시작!',
            playGame: false,
            problem: '',
            playGameAnalize: true,
        }
    },
    methods: {
        ...mapActions(['saveGameResult', 'initMySessionId', 'initGameResult']),

        goSoloAnalize() {
            this.$router.push({ name: 'soloAnalize' })
        },
        goSolo() {
            this.$router.push({ name: 'solo' })
        },
        
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

            // listen() takes two arguments:
            // 1. A callback function that is invoked anytime a word is recognized.
            // 2. A configuration object with adjustable fields
            recognizer.listen(result => {
                const scores = result.scores // eslint-disable-line no-unused-vars
                // render the probability scores per class
                for (let i = 0; i < classLabels.length; i++) {
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

                }
            }, {
                includeSpectrogram: true, // in case listen should return result.spectrogram
                probabilityThreshold: 0.75,
                invokeCallbackOnNoiseAndUnknown: true,
                overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
            })

        },
        gameStart() {
            this.initGameResult()
            pitch_list = ['도', '레', '미', '파', '솔', '라', '시'];
            // pick_list에 나올 음계 저장
            // 최소 한 번씩 나오게 하는 구간
            let pick_list = ['시작!']
            for (let i=0; i<7; i++) {
                const pick_index = Math.floor(Math.random() * pitch_list.length);
                pick_list.push(pitch_list[pick_index]);
                pitch_list.splice(pick_index, 1);
            }
            // 최소 한 번씩 나오게 하는 구간 끝
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
                            console.log(grade_list)
                        }
                    }, 5000)
                } 
            }, 2000)
        },
        startTimer() {
            this.timer = 4;
            // count를 이용해서 문제 끝나면 타이머 사라지게 함
            let count = 10
            let timer = setInterval(() => {
                this.timer -= 1;
                count += 1
                if (this.timer === -1) {
                    this.timer = 4
                    color = 180;
                }
                if (count/5 === total_problem) {
                    clearInterval(timer)
                    this.timer = ''
                }
            }, 1000)
        },
        timerRed() {
            const timer = document.getElementById("solo-sound-timer");
            timer.style.color = `rgb(255, 180, 180)`;
            let count = 0
            const timerTextRed = setInterval(() => {
            color -= 3.6;
            timer.style.color = `rgb(255, ${color}, ${color})`;
            if (color <= -10) {
                count += 1;
            }
            if (count > total_problem-3) {
                clearInterval(timerTextRed);
            }
            }, 100);
        },
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

.game-content-my-cam{
    margin: auto;
    margin-left: 10px;
    height: 90%;
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 20px;
}

.game-content-info{
    background-color: rgba(0, 0, 0, 0.374);
    height: 90%;
    margin-top: auto;
    margin-bottom: auto;
    border-radius: 20px;
    margin-right: 10px;
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
}

.pitch-target{
    position: absolute;
    font-size: 3vw;
    color: white;
}

#solo-sound-timer{
    position: absolute;
    left: 10%;
    top: 15%;
    font-size: 5vh;
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
}

.solo-start-button{
  background-color: #DDB13E !important;
  color: white !important;
  font-family: 'JUA', serif !important;
  font-size: 2vw !important;
  width: 80% !important;
  height: 6vh !important;
  margin-left: 0 !important;
  cursor: url(../../assets/cursor_click.png), auto !important;
  -webkit-animation: flickerAnimation 1s infinite;
  -moz-animation: flickerAnimation 1s infinite;
  -o-animation: flickerAnimation 1s infinite;
  animation: flickerAnimation 1s infinite;
}
.solo-start-button:hover {
  -webkit-animation: false;
  -moz-animation: false;
  -o-animation: false;
  animation: false;
}
</style>