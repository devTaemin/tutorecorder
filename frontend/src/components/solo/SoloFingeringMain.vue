<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-my-cam">
        <div id="webcam-container"></div>
        <!-- <div id="label-container"></div> -->

        </el-col>
        <el-col :span="8" class="game-content-info">
            <div class="game-content-title">운지법</div>
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
                    <el-button :class="{ 'solo-start-button': !playGame, 'solo-start-button-playgame': playGame }" :disabled="playGame" @click="gameStart();">{{ gameState }}</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>




<script type="text/javascript">
import '@tensorflow/tfjs'
import axios from "axios";

import { mapActions } from 'vuex'


let pick_list = ['도', '레', '미', '파', '솔', '라', '시'];


const total_problem = 9; //총 문제 수

let model, webcam,  maxPredictions; //teachable에서 사용할 변수 labelContainer,

const ImageURL = "https://teachablemachine.withgoogle.com/models/ic2Rvnu7Z/"; //image 데이터

// 음계 측정값 넣을 리스트 - 현재 7개의 음과 배경소음만 있고 나중에 삑사리 추가
let grade_list = [[], [], [], [], [], [], []];


axios.defaults.headers.post["Content-Type"] = "application/json";


// 타이머 텍스트 색상
let color = 180; 

export default {
    name: 'SoloSoundMain',
    components: {
    },
    data() {
        return {
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
        
        gameStart() {
            this.initGameResult()
            
            // pick_list에 나올 음계 저장
            // 최소 한 번씩 나오게 하는 구간
            pick_list = ['시작!','도', '레', '미', '파', '솔', '라', '시']
            
            // 최소 한 번씩 나오게 하는 구간 끝

            pick_list.push('참 잘했어요')

            this.playGameAnalize = true
            this.gameState = '게임 진행중...'
            this.playGame = true
            this.pitch_target = '준비하세요'; //칠판에 초기값으로 먼저 들어가 있는 값
            let index = 0;
            grade_list = [[], [], [], [], [], [], []];
            let game = setInterval(() => {
                this.pitch_target = pick_list[index]; //게임시작하면 pick_list의 값이 하나씩 추가
                // index에 몇 가지 나올지 저장
                index = (index + 1) % total_problem;
                if (index === 2) {
                    clearInterval(game);
                    this.startTimer();
                    this.timerRed();
                    this.problem = '1' + '/' + (total_problem - 2)
                    game = setInterval(() => {
                        this.problem = index + '/' + (total_problem - 2)
                        if (index > 7) {
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
                            console.log((grade_list[0].reduce((a,b) => a+b, 0)/grade_list[0].length)*100)
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
        //image 인식 시작
        async image() {
            console.log('시작')
            const modelURL = ImageURL + "model.json";
            const metadataURL = ImageURL + "metadata.json";

            // load the model and metadatanpm
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await window.tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Convenience function to setup a webcam
            const flip = true; // whether to flip the webcam

            //webcam-container의 사이즈의 값을 가져옴
            const webcamContainer = document.getElementById("webcam-container");
            const vwidth = webcamContainer.offsetWidth; 
            const vheight = webcamContainer.offsetHeight;
            
            //가져온 사이즈 값으로 webcam 사이즈를 지정
            webcam = new window.tmImage.Webcam(vwidth, vheight, flip); // width, height, flip
            await webcam.setup(); // request access to the webcam   
            await webcam.play();

            window.requestAnimationFrame(this.loop);

            console.log(webcam.width);
            console.log(webcam.height);

            // append elements to the DOM
           webcamContainer.appendChild(webcam.canvas);     
            
            console.log("Asdfdsafsda");
            console.log(webcam.canvas.width);
            console.log(webcam)
            
   
        },
        async loop() {
            webcam.update(); // update the webcam frame
            await this.predict();
            window.requestAnimationFrame(this.loop);
        },
        // run the webcam image through the image model
        async predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            let Array = [0,0,0,0,0,0,0,0];
            for (let i = 0; i < maxPredictions; i++) {
                // const classPrediction =
                //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                //  labelContainer.childNodes[i].innerHTML = classPrediction;

                //console.log(prediction)

                Array[i] = prediction[i].probability;

                const index = Array.indexOf(Math.max(...Array));
                switch(this.pitch_target) {
                            case '도':
                                if (index === 0) {
                                    grade_list[0].push(1)
                                } else if(index !== 4){
                                    grade_list[0].push(0)
                                }
                                break;
                            case '레':
                                if (index === 1) {
                                    grade_list[1].push(1)
                                } else if(index !== 4) {
                                    grade_list[1].push(0)
                                }
                                break;
                            case '미':
                                if (index === 2) {
                                    grade_list[2].push(1)
                                } else if(index !== 4) {
                                    grade_list[2].push(0)
                                }
                                break;
                            case '파':
                                if (index === 3) {
                                    grade_list[3].push(1)
                                } else if(index !== 4){
                                    grade_list[3].push(0)
                                }
                                break;
                            case '솔':
                                if (index === 5) {
                                    grade_list[4].push(1)
                                } else if(index !== 4){
                                    grade_list[4].push(0)
                                }
                                break;
                            case '라':
                                if (index === 6) {
                                    grade_list[5].push(1)
                                } else if(index !== 4) {
                                    grade_list[5].push(0)
                                }
                                break;
                            case '시':
                                if (index === 7) {
                                    grade_list[6].push(1)
                                } else if(index !== 4){
                                    grade_list[6].push(0)
                                }
                                break;
                            default:
                                // code block for default case
                        }
                // console.log('음계 : ' + prediction[i].className);
                // console.log('예측치 : ' + prediction[i].probability.toFixed(2)); 
            }
            //console.log(grade_list)


    }


    },
    mounted() {
        this.image()
    }
}

</script>

<style>
#webcam-container{
    width: 100%;
    height: 100%;
}

.game-content-container{
    height: 100%;
}

.game-content-my-cam{
    margin: auto;
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
</style>