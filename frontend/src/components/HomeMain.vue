<template>
  <div class="hello">
    <img id="logo-img" class="logo-img" @click="rotateY" src="../assets/logo.png" alt="logo img"> 
    <img class="start-img" @click="nameSetVisible=true" src="../assets/start.png" alt="start img">

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
    }
  },
  computed: {

  },
  methods: {
    ...mapActions(['setMyUserName']),
    enterkeyup: function(){
      console.log('111111')
    },

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
    rotateY: () => {
      const element = document.getElementById("logo-img");
      element.classList.add("rotateY")
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
.logo-img{
  width: 30vw;
  min-width: 60vh;
  position: absolute;
  z-index: 2;
  top:5%;
}
#logo-img.rotateY {
  animation: rotateY 3s;
}
@keyframes rotateY {
  from {
    transform: rotateY(0deg);
  } to {
    transform: rotateY(360deg);
  }
}
.start-img{
  position: absolute;
  width: 13vw;
  min-width: 20vh;
  z-index: 2;
  top: 80%;
  cursor: pointer;
  -webkit-animation: flickerAnimation 1s infinite;
  -moz-animation: flickerAnimation 1s infinite;
  -o-animation: flickerAnimation 1s infinite;
  animation: flickerAnimation 1s infinite;
}
.start-img:hover {
  -webkit-animation: false;
  -moz-animation: false;
  -o-animation: false;
  animation: false;
}
@keyframes flickerAnimation {
  0%, 100%   { filter: brightness(1); }
  50%  { filter: brightness(1.5); }
}
@-o-keyframes flickerAnimation{
  0%, 100%   { filter: brightness(1); }
  50%  { filter: brightness(1.5); }
}
@-moz-keyframes flickerAnimation{
  0%, 100%   { filter: brightness(1); }
  50%  { filter: brightness(1.5); }
}
@-webkit-keyframes flickerAnimation{
  0%, 100%   { filter: brightness(1); }
  50%  { filter: brightness(1.5); }
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

.nickname-input-button{
  width: 8vw !important;
  background-color: #3AD84A !important;
  font-family: 'JUA', serif;
  font-size: 1.5vw !important;
}

.errorMessage{
  color: red;
  font-size: 20px;
}
</style>
