<template>
  <div class="hello">
    <div style="width:80%;  margin:auto; margin-top:5%;">
      <img src="../assets/logo.png" alt="logo img" style="width:60%;" > 
      
      <div @click="nameSetVisible=true" style="cursor:pointer; padding-top:20%;">
        <!-- <img src="../assets/star.png" alt="star img" style="height:52px;"> -->
        <img src="../assets/start.png" alt="start img" style="width:20%;">
      </div>
    </div>


    <el-dialog
      v-model="nameSetVisible"
      :show-close="false"
      :class="{'modal-container': this.inputCorrect === true, 'modal-container-wrong': this.inputCorrect === false }"
      :show-header="false"
      :modal-append-to-body="true"
    >
      <!-- 입력 칸 -->
      <el-form
      >
      <el-form-item>
        <span style="font-size:1.5vw">닉네임</span>
        <el-input v-model="userName"  class="nickname-input"/>
        <el-button @click="setName" class="nickname-input-button">입장</el-button>
      </el-form-item>
      <div class="errorMessage">{{ errorMessage }}</div>
      </el-form>
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
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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
