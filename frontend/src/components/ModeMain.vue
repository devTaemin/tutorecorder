<template>
    <div id="backgroundContainer">
        <div id="logoContainter">
            <img id='logo' src="@/assets/logo_nocircle.png" alt="logo img" >
        </div>

        <div id="blueBoxContainer">
            <div id="redBoxComponent" @click="moveSoloPage">
                <img id="iconImg" src="../assets/modeSelect-solo.png" alt="modeSelect-solo img" style="width:35%;">
                <img id="textImg" src="../assets/text/solo_play.png" alt="혼자하기">
            </div>
            <div id="redBoxComponent" @click="roomEnterVisible=true">
                <img id="iconImg" src="../assets/modeSelect-multi.png" alt="modeSelect-multi img" style="width:83%; margin-bottom: 8%;">
                <img id="textImg" src="../assets/text/multi_play.png" alt="같이하기">
            </div>
            <div id="redBoxComponent" @click="roomMakeVisible=true">
                <img id="iconImg" src="../assets/modeSelect-makeRoom.png" alt="modeSelect-makeRoom img" style="width:45%;">
                <img id="textImg" src="../assets/text/make_room.png" alt="방만들기">
            </div>
        </div>


        
        <!-- 뒤로가기, 홈버튼 -->
        <!-- 이미지 방향은 놔두기 playroom branch 에서 수정함 -->
        <div id="iconContainer">
            <span @click="goback" id="subIconContainer" style="visibility:hidden">
                <img id="gobackImg" src="@/assets/goback.png" alt="돌아가기 img">
                <img id="gobackText" src="@/assets/gobackText.png" alt="돌아가기">
            </span>
            <span @click="goHome" id="subIconContainer">
                <img id="homeImg" src="@/assets/homeButton.png" alt="홈 img" >
                <img id="homeText" src="@/assets/homeText.png" alt="홈">
            </span>            
        </div>
        <!-- 뒤로가기, 홈버튼  -->

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
        },

        goHome() {
            console.log('go home')
            this.$router.push({ name: 'home' })
        }

        }
}
</script>

<style scoped>    
    #backgroundContainer{
        border-radius: 30px;
        width: 90vw;  
        height: 90vh;
        background-color: rgba(0, 0, 0, 0.374);
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
        margin-top: 5vh;
    }
    #logoContainter{
        width: 40%;
    }

    #logo{
        /* border: 5px solid yellow; */
        width: 60%;
        margin-top: 2%;
    }

    /* 카드 */
    #blueBoxContainer{
        /* border: 5px solid blue; */
        display: flex;
        width: 80%;
        height: 60%;
    }
    #redBoxComponent{
        /* border: 5px solid red; */
        width: 40%;
        height: 99%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background-color: #F2E6E6;   
        border-radius: 20px;
        margin-left: 2%;
        margin-right: 2%;
        
    }

    #iconImg{
        /* border: 5px solid violet; */
        /* width: 50%; */
        /* 비중이 달라 각자 적용 */
    } 
    #textImg{
        /* border: 5px solid gold; */
        width: 60%;
        margin-top: 10%;
    }


    /* 카드 끝 */


    /* 하단 아이콘 */
    #iconContainer{
        /* border: 5px solid  white; */
        width: 99%;
        margin-top: 2%;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 5vh;
    }
    #subIconContainer{
        /* border: 5px solid black; */
        width: 10%;
        min-width: 15vh;

    }
    #gobackImg{
        width: 40%;
        /* border: 2px solid greenyellow; */
    }
    #gobackText{
        width: 50%;
        /* border: 2px solid violet; */
    }
    #homeImg{
        width: 40%;
        /* border: 2px solid blue; */
    }
    #homeText{
        width: 50%;
        /* border: 2px solid red; */
    }
    /* 하단 아이콘 끝 */



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