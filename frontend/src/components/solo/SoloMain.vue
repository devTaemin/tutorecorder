<template>
    <div id="backgroundContainer">
        <div id="logoContainter">
            <img id='logo' src="@/assets/logo_nocircle.png" alt="logo img" >
        </div>

        <div id="blueBoxContainer">
            <div id="redBoxComponent" @click="moveSoloTutorial">
                <img id="iconImg" src="@/assets/soloSelect-tutorial.png" alt="튜토리얼 img">
                <img id="textImg" src="@/assets/text/solo_tutorial.png" alt="튜토리얼">

            </div>
            <div id="redBoxComponent" @click="moveSoloSound">
                <img id="iconImg" src="@/assets/soloSelect-sound.png" alt="소리내기 img">
                <img id="textImg" src="@/assets/text/solo_sound.png" alt="소리내기">
            </div>
            <div id="redBoxComponent" @click="moveSoloSong">
                <img id="iconImg" src="@/assets/soloSelect-song.png" alt="연주하기 img">
                <img id="textImg" src="@/assets/text/solo_song.png" alt="연주하기">
            </div>
        </div>
        
        <!-- 뒤로가기, 홈버튼 -->
        <!-- 이미지 방향은 놔두기 playroom branch 에서 수정함 -->
        <div id="iconContainer">
            <span @click="goback" id="subIconContainer">
                <img id="gobackImg" src="@/assets/goback.png" alt="돌아가기 img">
                <img id="gobackText" src="@/assets/gobackText.png" alt="돌아가기">
            </span>
            <span @click="goHome" id="subIconContainer">
                <img id="homeImg" src="@/assets/homeButton.png" alt="홈 img" >
                <img id="homeText" src="@/assets/homeText.png" alt="홈">
            </span>            
        </div>
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
        moveSoloFingering: function() {
            this.$router.push({ name :'soloFinger' })
        },
        goback() {  
            this.$router.push({ name: 'mode' })
        },
        goHome() {
            this.$router.push({ name: 'home' })
        },

    },  

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
        justify-content: space-between;
        align-items: center;
        /* width: 80%; */
        /* height: 30%; */
        
        display: flex;
        width: 80%;
        height: 60%;
        
         
    }
    #redBoxComponent{
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
        cursor: url(../../assets/cursor_click.png), auto !important;
 
       
    }

    #iconImg{
        /* border: 5px solid violet; */
        /* width: 20%; */
        
        width: 60%;
        margin-top: 10%;
       
    } 
    #textImg{
        /* border: 5px solid gold; */
        /* width: 45%; */
        height: 10vh;
        margin-left: 4% ;

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
        cursor: url(../../assets/cursor_click.png), auto !important;
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

</style>