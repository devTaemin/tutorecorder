<template>
    <div class="tutorial-content-container">
        <img id='logo' src="@/assets/logo_nocircle.png" alt="logo img" >
        
        <div id="blueBoxContainer">
            <div id="redBoxComponent" @click=goViedeo(0)>
                <img id="iconImg" src="../../assets/Tonguing.png" alt="modeSelect-solo img"  
                    style="width:80%;  margin-top:14%; margin-bottom: 10%;">
                <span id="textImg"> 텅잉 및 자세</span  >
            </div>
            <div id="redBoxComponent" @click=goViedeo(1)>
                <img id="iconImg" src="../../assets/baroque_grab.png" alt="modeSelect-solo img">
                <span id="textImg"> 바로크식</span  >
            </div>
            <div id="redBoxComponent" @click=goViedeo(2)>
                <img id="iconImg" src="../../assets/german_grab.png" alt="modeSelect-solo img">
                <span id="textImg"> 저먼식</span>
            </div>
        </div>

        <el-button class="solo-out-button" id="solo-tutorial-button" @click="completeTutorial">나가기</el-button>
    </div>
</template>
<script>
export default {
    name: 'SoloTutorialMain',
    props: {
    },
    data() {
        return{
            index:2,
        }
    },
    methods: {
        goViedeo(n) {
            this.$store.state.videoIndex=n
            this.$router.push({ name: 'soloTutorialSelect' })
            
        },
        completeTutorial() {
            this.$router.push({ name: 'solo' })
        },

    }


}
</script>

<style scoped>
.tutorial-content-container{
    background-color: rgba(0, 0, 0, 0.374);
    width: 90%;
    height: 90%;
    border-radius: 30px;
    display:flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
}
#solo-tutorial-button{
    margin: 10px 0px 15px 0px;
    width: 80%;
}

    #logo{
        /* border: 5px solid yellow; */
        width: 20%;
        margin-top: 2%;
    }

    /* 카드 */
    #blueBoxContainer{
        /* border: 5px solid blue; */
        width: 90%;
        height: 60%;
        display: flex;
        flex-direction: row;
        margin-top: 3%;

    }
    #redBoxComponent{
        /* border: 5px solid red; */
        width: 30%;
        height: 99%;
        background-color: #F2E6E6;   
        border-radius: 20px;        
        margin-left: 3%;    

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        font-size: 5vh;
        color: rgb(206, 102, 37);

    }


    
    #iconImg{
        /* border: 5px solid violet; */
        width: 70%;
        /* 비중이 달라 각자 적용 */
    } 
    #textImg{
        /* border: 5px solid gold; */
        width: 60%;
        margin-top: 10%;
    }

    /* 카드 끝 */



</style>