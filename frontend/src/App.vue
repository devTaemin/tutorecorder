<template>
  <div>
    <div id="background-image">
      <router-view/>
      <div id="char1" class="char1 enlarge" @click="disappear"></div>
      <div id="char2" class="char2 shake" @click="move"></div>
      <div id="char3" class="char3 enlarge" @click="popUp"></div>
      <div id="char4" class="char4 shake" @click="rotateChar"></div>
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

      disappear: () => {
        const element = document.getElementById("char1");
        element.classList.remove("enlarge")
        element.classList.add("disappear");
        setTimeout(function() {
          element.classList.remove('disappear')
          element.classList.add("enlarge")
        }, 3000);
      },

      move: () => {
        const element = document.getElementById("char2");
        element.classList.remove("shake")
        element.classList.add("moveChar");
        setTimeout(function() {
          element.classList.remove('moveChar')
          element.classList.add("shake")
        }, 3000);
      },

      popUp: () => {
        const element = document.getElementById("char3");
        element.classList.remove("enlarge")
        element.classList.add("popUp");
        setTimeout(function() {
          element.classList.remove('popUp')
          element.classList.add("enlarge")
        }, 3000);
      },

      rotateChar: () => {
        const element = document.getElementById("char4");
        element.classList.remove("shake")
        element.classList.add("rotateChar");
        setTimeout(function() {
          element.classList.remove('rotateChar')
          element.classList.add("shake")
        }, 3000);
      },
      
    },
    mounted() {
      this.generateSnow(50)
    },
}
</script>
<style>
  @import '@/appStyle.css';
  @import '@/appCharacter.css';
  @import '@/appSnow.css';
</style>