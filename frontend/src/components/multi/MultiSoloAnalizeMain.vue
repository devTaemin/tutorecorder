<template>
    <div class="modal" >   
        <div class="overlay">
            <!--  -->
            <div id="container">
                
                <!-- 랭크 -->
                <div id="redBoxLeft" >
                    <div class="analize-result-title">순위</div>
                    <div id="leftSubBox">
                        
                        <!-- 텍스트 삽입 구간 -->
                        <p style="width:30%; padding-top:15%; z-index:4321;" class="ranker-name">{{ n2 }}</p>
                        <p style="width:30%; padding-bottom:12%; z-index:4321;" class="ranker-name">{{ n1 }}</p>
                        <p style="width:30%; padding-top:15%; z-index:4321;" class="ranker-name">{{ n3 }}</p>
                        <!-- 텍스트 삽입 구간 끝 -->
                       
                        <img src="../../assets/multi/rank.png" alt="랭크" 
                        style="width:80%; margin-top: -17%;">
                        <p id="totalScore">종합점수 : {{ myTotalScore }}점</p>
                    </div>

                </div>
                <!-- 랭크 끝 -->

            </div>
            <div>
                <el-button class="solo-out-button" @click="closeAnal" style="margin-top:0%;">나가기</el-button>
            </div>
            
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'MultiSoloAnalizeMain',
    mounted() {
        this.$emit('sendMyTotalScore', this.myTotalScore);
        },
    data() {
        return{


            // 연결 필요
            totalgrade: 0,
            n1:'player1',
            n2:'player2',
            n3:'player3',
        }
    },
    props: {
        isOwner: Boolean,
        ranker: Object,
    },
    watch: {
        ranker() {
            this.n1 = Object.values(this.ranker)[0][0]
            if (Object.values(this.ranker).length >= 2) {
                this.n2 = Object.values(this.ranker)[1][0]
            } else {
                this.n2 = ''
            }
            if (Object.values(this.ranker).length >= 3) {
                this.n3 = Object.values(this.ranker)[2][0]
            } else {
                this.n3 = ''
            }
        }

    },
    computed: {
        myTotalScore() {
            return this.$store.state.gameResult;
        }
    },
    methods: {
        ...mapActions(['saveGameResult', 'initMySessionId', 'initGameResult']),
        goSoloSound() {
            this.$router.push({ name: 'soloSound' })
        },
        closeAnal() {
            this.initGameResult()
            if (this.isOwner === true) {
                this.$emit('closeAnal')

            } else {
                this.$emit('closeAnalAlone')
            }
        }
    }
}



</script>

<style scoped>

.modal{
    width: 50%;
    height: 99%;
    position: fixed;
    z-index:1234;


}
.overlay{
    /* border: 5px solid black; */
    margin-top:2%;
    background-color: #F2E6E6;
    border: 5px solid black;
    border-radius: 40px;
    /* opacity:0.5 */
}


#container{
    /* border: 5px solid  gray;     */
    width: 99%;
    height: 83vh;
    display: flex;
    justify-content: space-evenly;
}




/* 왼쪽 */
#redBoxLeft{
    border-radius: 40px;
    width: 70%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.analize-result-title{
    /* border: 5px solid gold; */
    font-size: 2vw;    
    text-align: start;
    padding-top: 2%;
    font-family: 'JUA', serif;
    text-align: center;
}
#leftSubBox{
    /* border: 5px solid hotpink; */
    width: 80%;
    height:90%;
    margin-top:5vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;    
}

#captureImg{
    /* border: 5px solid brown; */
    margin:5%;
    width:7vw;
    /* height: 10%;; */

    /* 위치 조정은 인라인으로 여백 조정 */
}
#totalScore{
    /* border:5px solid red;  */
    width:47%;
    height:8%;
    font-family: 'JUA', serif;
    font-size: 2vw;
  
    
}
/* 왼쪽 끝 */

/* 오른쪽  */

#analize-container{
    /* border: 5px solid blue; */
    
    background-color: rgba(0, 0, 0, 0.374);
    height: 80vh;
    width: 45vw;
    
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}



.demo-progress{
    margin-top: 3vh;
}

.demo-progress .el-progress--line{
  width: 33vw;
}

.pitch{
    font-size: 5vh;
    margin-right: 2vw;
    font-family: 'JUA', serif;
}

.pitch-container{
    display: flex;
    justify-content: center;
    align-items: center;
}

.analize-result{
    height: 25%;
    width: 90%;
    border-radius: 20px;
    background-color: #DFE4F6;
    margin-top: 2%;
    font-family: 'JUA', serif;
}

.grade-img{
    margin-left: 2%;
    width: 30px;
    height: 30px;
}

.ranker-name{
    font-family: 'JUA', serif;
    font-size: 4vh;
}
</style>