<template>
    <div id="background">
        <img src="../assets/logo_nocircle.png" alt="logo img" style="width:20%;" > 

        <el-row :gutter="20" style="padding-left:5%;">
            <!-- 아이콘은 각자의 크기가 달라 크기를 각자 설정 -->
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloPage">
                    <div><img id="iconImg" src="../assets/modeSelect-solo.png" alt="modeSelect-solo img" style="width:50%"></div>
                    <div><img id="textImg" src="../assets/text/solo_play.png" alt="혼자하기"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" @click="roomEnterVisible=true">
                    <div><img id="iconImg" src="../assets/modeSelect-multi.png" alt="modeSelect-multi img" style="width:100%;"></div>
                    <div><img id="textImg" src="../assets/text/multi_play.png" alt="같이하기" style="margin-top: 20%;"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" @click="roomMakeVisible=true">
                    <div><img id="iconImg" src="../assets/modeSelect-makeRoom.png" alt="modeSelect-makeRoom img" style="width:60%"></div>
                    <div><img id="textImg" src="../assets/text/make_room.png" alt="방만들기"></div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 같이하기 모달 -->
        <el-dialog v-model="roomEnterVisible" :show-close="false" :show-header="false" :modal-append-to-body="true"
            :class="{'modal-container': this.inputCorrect === true, 'modal-container-wrong': this.inputCorrect === false }">
            <!-- 입력 칸 -->
            <span style="font-size:1.5vw">참여코드</span>
            <el-input v-model="roomCode" @keyup.enter="enterRoom" class="nickname-input"/>
            <el-button @click="enterRoom" class="enterCode-input-button">입장</el-button>
            <div class="errorMessage">{{ errorMessage }}</div>
        </el-dialog>
        <!-- 같이하기 모달 끝-->


        <!-- 방만들기 모달 -->
        <el-dialog v-model="roomMakeVisible" title="" width="40%">
            <el-form label-width="100px" style="max-width:500px">
                <el-form-item label="방 코드 설정">
                    <el-input v-model="roomCode" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="roomMakeVisible=false">취소</el-button>
                <el-button type="success" @click="createRoom">생성</el-button>
            </template>
        </el-dialog>
        <!-- 방만들기 모달 끝-->

    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'ModeMain',
    data() {
        return {
            roomEnterVisible: false,
            roomMakeVisible: false,
            roomCode: '',

            inputCorrect: true,
            errorMessage: '',
        }
    },
    computed: {

    },
    methods: {
        ...mapActions(['initMySessionId', 'setMySessionId']),

        moveSoloPage: function() {
            this.$router.push({ name: 'solo' })
        },


        enterRoom: function() {
            // 세션 코드 검사 후 예외 처리 (일치하는 방 정보 유무)
            // 유효성 검사  - 수정 필요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if (this.roomCode === '') {
                this.inputCorrect = false
                this.errorMessage = '참여코드를 입력해주세요!'
                this.roomCode = ''
            } else if (this.roomCode.length > 5) {
                this.inputCorrect = false
                this.errorMessage = '참여코드를 확인해 주세요!(5글자)'
                this.roomCode = ''
            } else {
                this.inputCorrect = true
                this.roomEnterVisible=false
                this.errorMessage = ''
            // 유효성 검사 끝
    
                // 방에 접속하는 코드
                this.setMySessionId(this.roomCode)
                console.log("방 입장");
                this.roomCode='';
                this.roomEnterVisible=false;
    
                // DEBUG
                this.$router.push({ name: 'test' })
            }
        },


        createRoom: function() {
            // 방 생성
            this.setMySessionId(this.roomCode)

            console.log("방 생성");
            this.roomCode='';
            this.roomMakeVisible=false;

            // DEBUG


            this.$router.push({ name: 'test' })
        }

        }
}
</script>

<style scoped>
 .el-card{
     /* border: 5px solid red; */
     width: 80%;
     height: 120%;
     display: flex;
     align-items: center;
     cursor: url(../assets/cursor_click.png), auto !important;
     border-radius: 20px;
     background-color: #F2E6E6;
 }
.tutorial-modal{
    background-color: #6624c9;;
}

#background{
    border-radius: 30px;
    width: 100%;  
    height: 99%;
    background-color: rgba(0, 0, 0, 0.374);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;

    aspect-ratio: 16/9;
}

 #textImg{
    width:70%;
 }


 /* 모달 css */
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

.enterCode-input{
  width: 20vw !important;
  margin-right: 2vw;
  margin-left: 1vw;
}

.enterCode-input-button{
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