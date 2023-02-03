<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-my-cam">
            내 카메라
        </el-col>
        <el-col :span="8" class="game-content-info">
            <div class="game-content-title">소리내기</div>
            <div class="game-content-target">
                <img id="board-image" src="../../assets/board.png">
                <span class="pitch-target" style="margin-top:">{{ pitch_target }}</span>
            </div>
            <div class="game-content-button">
                <el-button class="solo-analyze-button" @click="goSoloAnalize">분석</el-button>
                <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
                <button type="button" @click="gameStart(); init()">Start</button>
                <div id="label-container"></div>
            </div>
        </el-col>
    </el-row>
</template>

<script type="text/javascript">
import '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'
import { mapActions } from 'vuex'

const pitch_list = ['도', '레', '미', '파', '솔', '라', '시'];
const pitch_list2 = ['도', '레', '미', '파', '솔', '라', '시'];


// pick_list에 나올 음계 저장
// 최소 한 번씩 나오게 하는 구간
let pick_list = ['준비하세요', '시작!']
for (let i=0; i<7; i++) {
    const pick_index = Math.floor(Math.random() * pitch_list.length);
    pick_list.push(pitch_list[pick_index]);
    pitch_list.splice(pick_index, 1);
}
// 최소 한 번씩 나오게 하는 구간 끝

const problem = 3
// 랜덤으로 problem개 더 출력
for (let i=0; i<problem; i++) {
    pick_list.push(pitch_list2[Math.floor(Math.random() * 7)]);
}

pick_list.push('참 잘했어요!')
const total_problem = problem + 10;
const URL = "https://teachablemachine.withgoogle.com/models/m6ms0qdPf/";

// 음계 측정값 넣을 리스트 - 현재 7개의 음과 배경소음만 있고 나중에 삑사리 추가
let grade_list = [[], [], [], [], [], [], []];


export default {
    name: 'SoloSoundMain',
    data() {
        return {
            pitch_target: '',
        }
    },
    // created() {
    //     this.init();
    // },
    methods: {
        ...mapActions(['saveGameResult']),

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
            const labelContainer = document.getElementById('label-container') // 데이터 라벨 생성
            for (let i = 0; i < classLabels.length; i++) {
                labelContainer.appendChild(document.createElement('div'))
            }

            // listen() takes two arguments:
            // 1. A callback function that is invoked anytime a word is recognized.
            // 2. A configuration object with adjustable fields
            recognizer.listen(result => {
                const scores = result.scores // eslint-disable-line no-unused-vars
                // render the probability scores per class
                for (let i = 0; i < classLabels.length; i++) {
                    const classPrediction = classLabels[i] + ': ' + result.scores[i].toFixed(2) // 소숫점까지 표기(2자리)
                    //   console.log('음계' + classLabels[i])
                    //   console.log('점수' + result.scores[i])
                    // 도, 라, 레, 미, 배경소음, 솔, 시, 파
                    const index = result.scores.indexOf(Math.max(...result.scores));
                    console.log(index)
                    switch(this.pitch_target) {
                        case '도':
                            if (index === 0) {
                                grade_list[0].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[0].push(0)
                            }
                            break;
                        case '레':
                            if (index === 2) {
                                grade_list[1].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[1].push(0)
                            }
                            break;
                        case '미':
                            if (index === 3) {
                                grade_list[2].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[2].push(0)
                            }
                            break;
                        case '파':
                            if (index === 7) {
                                grade_list[3].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[3].push(0)
                            }
                            break;
                        case '솔':
                            if (index === 5) {
                                grade_list[4].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[4].push(0)
                            }
                            break;
                        case '라':
                            if (index === 1) {
                                grade_list[5].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[5].push(0)
                            }
                            break;
                        case '시':
                            if (index === 6) {
                                grade_list[6].push(result.scores[index])
                            } else if (index !== 4){
                                grade_list[6].push(0)
                            }
                            break;
                        default:
                            // code block for default case
                    }

            
                    labelContainer.childNodes[i].innerHTML = classPrediction
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
            let index = 0
            let timer = setInterval(() => {
                this.pitch_target = pick_list[index];
                // index에 몇 가지 나올지 저장
                index = (index + 1) % total_problem;
                if (index === 0) {
                    clearInterval(timer);
                    this.saveGameResult(grade_list)
                }
            }, 3000)
        },
    }
}

</script>

<style>

.game-content-container{
    height: 100%;
}

.game-content-my-cam{
    margin: auto;
    height: 90%;
    border: 1px solid blue;
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
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

.pitch-target{
    position: absolute;
    font-size: 3vw;
}
</style>