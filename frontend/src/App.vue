<template>
  <div>
    <div id="background-image">
      <router-view/>
      <div class="char1 enlarge"></div>
      <div class="char2 shake"></div>
      <div class="char3 enlarge"></div>
      <div class="char4 shake"></div>
      <div class="snow-wrapper">
        <transition-group @before-enter="randomPart">
          <div class="snow falling" v-for="snow in snowUnits" :key="snow">♩</div>
          <div class="snow falling" v-for="snow in snowUnits" :key="snow">♪</div>
          <div class="snow falling" v-for="snow in snowUnits" :key="snow">♬</div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name: 'App',
    components: {

    },
    data() {
      return {
        snowUnits: [],
        sequence: 0,
      }
    },
    methods: {
      addSnow(){
        this.snowUnits.push(this.sequence++)
      },

      generateSnow(size){
        
        for(let i=0; i<size; i++) {
          this.addSnow()
        }
      },

      randomPart(el) {
        // 1 left : 화면 - 오차 ~ 화면 + 오차 범위 내 생성
        const offset = 400;
        const min = -offset;
        const max = window.screen.width + offset;
        const left = this.RNG_INT(min, max)
        el.style.left = left + "px";

        // 2 scale : 0.25~1
        const scale = this.RNG_float(0.25, 1)
        el.style.transform = `scale(${scale})`;
        
        // 3 opacity: 0.1~1
        const opacity = this.RNG_float(0.1, 1)
        el.style.opacity = opacity;

        // 4 animation delay(1ms ~10000ms)
        const delay = this.RNG_float(1, 10000);
        el.style.animationDelay = delay+"ms"

        // 5 animation duration(10s~30s)
        const duration = this.RNG_float(10000, 30000);
        el.style.animationDuration = duration + 'ms'

        // 6 color
        const colors = ['#eb8484', '#8a95ea', '#8ecc7d', '#d9c000']
        const color_pick = colors[this.RNG_INT(0, 4)];
        el.style.color = color_pick
      },

      RNG_float(begin, end) {
        const max = Math.max(begin, end)
        const min = Math.min(begin, end)
        const range = max - min
        return Math.random() * range + min;
      },

      RNG_INT(begin, end) {
        return parseInt(this.RNG_float(begin, end))
      },

    },
    mounted() {
      this.generateSnow(50)
    }
}
</script>
<style>

@font-face { /* JUA 폰트 */
  font-family: "JUA";
  src: url("./assets/fonts/Jua-Regular.ttf") format("truetype");
  font-weight: normal;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  height: 100vh;
  font-family: 'JUA', serif;
}
#background-image{
  background-image: url("./assets/Background/BackgroundImage.png");
  width: 100vw;
  height: 100vh;
  background-size: 100vw 100vh;
  display: flex;
  justify-content: center;
}
.char1{
  background-image: url("./assets/Background/char1.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  height: 20vh;
  width:11.2vw;
  left: 6%;
  top: 45%;
  z-index: 2;
}
.char2{
  background-image: url("./assets/Background/char2.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  height: 20vh;
  width: 19vh;
  left: 38%;
  top: 55%;
  z-index: 2;
}
.char3{
  background-image: url("./assets/Background/char3.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  height: 15vh;
  width: 12vh;
  left: 60%;
  top: 55%;
  z-index: 2;
}
.char4{
  background-image: url("./assets/Background/char4.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  height: 13vh;
  width: 15vh;
  left: 85%;
  top: 65%;
  z-index: 2;
}

.pink-container{
  width: 95vw;
  height: 95vh;
  background-color: #F2E6E6;
  margin: auto;
  border-radius: 30px;
  position: relative;
  z-index: 3;
}

.solo-out-button{
    background-color: #F0AFAF !important;
    font-family: 'JUA', serif !important;
    font-size: 4vh !important;
    width: 10vw !important;
    height: 6vh !important;
}

.solo-analyze-button{
    background-color: #8684FF !important;
    color: white !important;
    font-family: 'JUA', serif !important;
    font-size: 4vh !important;
    width: 10vw !important;
    height: 6vh !important;
    margin-right: 3vw !important;
}

.mode{
  position: relative;
  z-index: 3;
}

.shake:hover {
  animation-name: shaking;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 0.5s;
}

@keyframes shaking {
  0% {
    transform: rotate(0deg);
  }
  30% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  90% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.enlarge:hover {
  animation-name: enlarging;
  animation-iteration-count: infinite;
  animation-duration: 1s;
}
@keyframes enlarging {
  0% {
    transform: scale(1)
  }
  5% {
    transform: scale(0.8)
  }
  60% {
    transform: scale(1.2)
  }
  70% {
    transform: scale(0.9)
  }
  80% {
    transform: scale(1.1)
  }
  90% {
    transform: scale(0.95)
  }
  100% {
    transform: scale(1)
  }
}
.snow-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  /* em으로 크기 설정할 때 쓰임 (1em은 1글자 높이) */
  font-size: 10px;
  z-index: 1;
}
.snow-wrapper > .snow {
  position: absolute;
  font-size: 50px;
  z-index: 1;
  top: -20%;
  left: 50%;
}
.snow.falling {
  animation-name: falling;
  animation-timing-function:linear;
  animation-iteration-count: infinite;
}
@keyframes falling {
  0% {top: -20%; 
    transform: rotate(-180deg);
  }
  100% {top: 120%;
    transform: rotate(360deg);
  }
}
</style>