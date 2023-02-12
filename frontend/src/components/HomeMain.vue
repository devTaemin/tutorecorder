<template>
  <div class="hello">
    <img id="logo-img" class="logo-img" @click="rotateLogo" src="../assets/logo.png" alt="logo img"> 
    <img class="start-img" @click="nameSetVisible=true" src="../assets/start.png" alt="start img">
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
    <el-dialog
      v-model="nameSetVisible"
      :show-close="false"
      :class="{'modal-container': this.inputCorrect === true, 'modal-container-wrong': this.inputCorrect === false }"
      :show-header="false"
      :modal-append-to-body="true"
    >
      <!-- 입력 칸 -->
      <span style="font-size:1.5vw">닉네임</span>
      <el-input @keyup.enter="setName" v-model="userName" class="nickname-input"/>
      <el-button @click="setName" class="nickname-input-button">입장</el-button>
      <div class="errorMessage">{{ errorMessage }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { Check } from '@element-plus/icons-vue'
import { mapActions } from 'vuex'


export default {
  name: 'HomeMain',
  data() {
    return {
      Check: Check,
      nameSetVisible: false,
      userName: '',
      inputCorrect: true,
      errorMessage: '',
      snowUnits: [],
      sequence: 0,
    }
  },
  computed: {

  },
  methods: {
    ...mapActions(['setMyUserName']),

    setName: function() {
      if (this.userName === '') {
        this.inputCorrect = false
        this.errorMessage = '닉네임을 입력해주세요!'
        this.userName = ''
      } else if (this.userName.length > 12) {
        this.inputCorrect = false
        this.errorMessage = '닉네임을 확인해 주세요!(12글자)'
        this.userName = ''
      } else {
        this.inputCorrect = true
        this.nameSetVisible=false
        this.setMyUserName(this.userName)
        this.errorMessage = ''
        this.$router.push({ name: 'mode' })
      }
    },
    rotateLogo: () => {
      const element = document.getElementById("logo-img");
      element.classList.add("rotateLogo");
      setTimeout(function() {
        element.classList.remove("rotateLogo");
      }, 3010);
    },

    // 눈 내리는 함수 시작
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
    this.generateSnow(20)
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "@/components/homeMainAnimation.css";
@import '@/appStyle.css';
@import '@/appCharacter.css';
@import '@/appSnow.css';
.hello {
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-container{
  border: 3px solid ;
  flex-basis: 95%;
}

.el-dialog__header{
  display: none;
}

.modal-container{
  border-radius: 20px !important;
  background-color: #B3F7A8 !important;
  width: 40vw !important;
}

.modal-container-wrong{
  border-radius: 20px !important;
  background-color: #F2B2B2 !important;
  width: 40vw !important;
}

.nickname-input{
  width: 20vw !important;
  margin-right: 2vw;
  margin-left: 1vw;
}
.el-input__inner{
  cursor: url(../assets/cursor_pen.png), auto !important;
}
.nickname-input-button{
  width: 8vw !important;
  background-color: #3AD84A !important;
  font-family: 'JUA', serif;
  font-size: 1.5vw !important;
  cursor: url(../assets/cursor_click.png), auto !important;
}

.errorMessage{
  color: red;
  font-size: 20px;
}

</style>
