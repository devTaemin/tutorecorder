<template>
    <div id="backgroundContainer">
        <div id="logoContainter">
            <img id='logo' src="@/assets/logo_nocircle.png" alt="logo img" >
        </div>

        <div id="containerStack">
            <div id="cardContainer" @click="moveSoloTutorial">
                <!-- <div><img id="iconImg" src="@/assets/soloSelect-tutorial.png" alt="튜토리얼 img"></div> -->
                <div><img id="iconImg" src="@/assets/rectan.png" alt="튜토리얼 img"></div>
                <div><img id="textImg" src="@/assets/text/solo_tutorial.png" alt="튜토리얼"></div>
            </div>
            <div id="cardContainer" @click="moveSoloSound">
                <!-- <div><img id="iconImg" src="@/assets/soloSelect-sound.png" alt="소리내기 img"></div> -->
                <div><img id="iconImg" src="@/assets/rectan.png" alt="소리내기 img"></div>
                <div><img id="textImg" src="@/assets/text/solo_sound.png" alt="소리내기"></div>
            </div>
            <div id="cardContainer" @click="moveSoloSong">
                <!-- <div><img id="iconImg" src="@/assets/soloSelect-song.png" alt="연주하기 img"></div> -->
                <div><img id="iconImg" src="@/assets/rectan.png" alt="연주하기 img"></div>
                <div><img id="textImg" src="@/assets/text/solo_song.png" alt="연주하기"></div>
            </div>
        </div>

        
        <!-- 뒤로가기, 홈버튼 -->
        <!-- 이미지 방향은 놔두기 playroom branch 에서 수정함 -->
        <!-- <div id="iconContainer">
            <div @click="goback">
                <img id="backImg" src="@/assets/goback.png" alt="돌아가기">
                <span>돌아가기</span>
            </div> -->
            <!-- <img id="homeImg" src="@/assets/homeButton.png" alt="홈" @click="goHome"> -->
        <!-- </div> -->
        <!-- style="cursor: pointer; width: 5%; position: absolute; left: 48%; bottom: 5%;" -->
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
    position: relative;
}

/* #logoContainter{
    border: 5px solid yellow;
    width: 50%;
    margin-top: 2%;
    position: inherit;
} */

#logo{
    border: 5px solid yellow;
    position: absolute;
    width: 25%;
    height: 20%;
    margin-top: 2%;
        
}

/* 카드 */
#containerStack{
    border: 10px solid blue;
    width: 70%;
    height: 40%;
    margin-top: 13%;
    position: absolute;
}
#cardContainer{
    position: absolute;
    border: 5px solid rgb(141, 46, 67);
    width: 100%;
    height: 100%;
    display: flex;
    justify-items: left;
}

#iconImg{
    border: 5px solid red;
    width: 50%;
    height: 80%;
    position: absolute;
} 
#textImg{
    border: 10px solid greenyellow;
    width: 50%;
    height: 50%;
    position: absolute;
    left: 25%;
}
.el-card{
    border: 5px solid red;
    cursor: pointer;
    border-radius: 20px;
    background-color: #F2E6E6;
    position: absolute;
    height: 100%;
    
}
/* 카드 끝 */


/* 하단 아이콘 */
#iconContainer{
    width:90%;
    height:10%;
    display: flex;
    border: 5px solid pink;
    font-size: 4em;    
}
#homeImg{
    width:5%;
}
#backImg{
    width:5%;
}
/* 하단 아이콘 끝 */

</style>