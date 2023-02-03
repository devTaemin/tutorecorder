<template>
    <div id="background">
        <img id="logo" src="@/assets/logo_nocircle.png" alt="logo img" > 

        <el-row id="card-container" :gutter="20" >
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloTutorial">
                    <div><img id="iconImg" src="@/assets/soloSelect-tutorial.png" alt="튜토리얼 img"></div>
                    <div><img id="textImg" src="@/assets/text/solo_tutorial.png" alt="튜토리얼"></div>
                </el-card>  
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloSound" >
                    <div><img id="iconImg" src="@/assets/soloSelect-sound.png" alt="소리내기 img"></div>
                    <div><img id="textImg" src="@/assets/text/solo_sound.png" alt="소리내기"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloSong" >
                    <div><img id="iconImg" src="@/assets/soloSelect-song.png" alt="연주하기 img"></div>
                    <div><img id="textImg" src="@/assets/text/solo_song.png" alt="연주하기"></div>
                </el-card>
            </el-col>
        </el-row>

        <div style="height:10vh"></div>

        <!-- 뒤로가기, 홈버튼 -->
        <!-- 이미지 방향은 놔두기 playroom branch 에서 수정함 -->
        
            <img id="backImg" src="@/assets/goback.png" alt="돌아가기"  @click="goback"
                style="cursor: pointer; width:5%; position: absolute; left: 2%; bottom: 5%;">
    
            <img id="homeImg" src="@/assets/homeButton.png" alt="홈" @click="goHome"
                style="cursor: pointer; width: 5%; position: absolute; left: 48%; bottom: 5%;">
        
        <!-- 뒤로가기, 홈버튼  -->
    </div>
</template>
<script>

export default {
    name: 'SoloMain',
    methods: {
        moveSoloTutorial: function() {
            this.$router.push({ name: 'soloTutorial' })
        },
        moveSoloSound: function() {
            this.$router.push({ name: 'soloSound' })
        },
        moveSoloSong: function() {
            this.$router.push({ name: 'soloSong' })
        },
        goback() {  
            console.log('go mode select')
            this.$router.push({ name: 'mode' })
        },
        goHome() {
            console.log('go home')
            this.$router.push({ name: 'home' })
        }

    },

}
</script>

<style scoped>
.hover-button{
    cursor: pointer;
}

#background{
    border-radius: 30px;
    width: 90vw;  
    height: 90vh;
    background-color: rgba(0, 0, 0, 0.374);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5vh;
    position: relative;
}

#logo{
    width: 20%;
    margin-top: 2%;
    margin-bottom: 2%;
}

/* 카드 */
#card-container{
    width:90%;
}
.el-row{
    /* border:   10px solid gray; */
    position: absolute;
    left: 9%;
    top: 30%;
    width: 40vw;
}
.el-card{
    border: 5px solid red;
    width: 20vw;
    height: 35vh;
    cursor: pointer;
    border-radius: 20px;
    background-color: #F2E6E6;
    position: relative;
    
}
#iconImg{
    width: 40%;
    position: absolute;
    left: 30%;
} 
#textImg{
    width:70%;
    position: absolute;
    bottom: 1%;
    left: 15%
}
/* 카드 끝 */


/* 하단 아이콘 */
/* #iconContainer{
    margin-top:5%;
}
 #homeImg{
    z-index:1234;
 }
 #backImg{
    z-index: 1234;
 } */
 /* 하단 아이콘 끝 */

</style>