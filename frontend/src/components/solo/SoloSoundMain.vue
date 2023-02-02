<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-my-cam">
            내 카메라
        </el-col>
        <el-col :span="8" class="game-content-info">
            <div class="game-content-title">소리내기</div>
            <div class="game-content-target">
                <img id="board-image" src="../../assets/board.png" alt="">
                <span>{{ pitch_target }}</span>
            </div>
            <div class="game-content-button">
                <el-button class="solo-analyze-button" @click="goSoloAnalize">분석</el-button>
                <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
                <button type="button" @click="init">Start</button>
                <div id="label-container"></div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'

const pitch_list = ['도', '레', '미', '파', '솔', '라', '시'];
let pick_list = []
for (let i=0; i<5; i++) {
    pick_list.push(pitch_list[Math.floor(Math.random() * 7)])
}


export default {
    name: 'SoloSoundMain',
    props: {
        msg: String
    },
    methods: {
        goSoloAnalize() {
            this.$router.push({ name: 'soloAnalize' })
        },
        goSolo() {
            this.$router.push({ name: 'solo' })
        },
        async createModel () {
      const URL = 'https://teachablemachine.withgoogle.com/models/m6ms0qdPf/'

      const checkpointURL = URL + 'model.json' // model topology
      const metadataURL = URL + 'metadata.json' // model metadata

      const recognizer = speechCommands.create(
        'BROWSER_FFT', // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL)

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
    }
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
</style>