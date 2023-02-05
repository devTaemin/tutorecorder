<template>
    <div id="background">
        <img src="@/assets/logo_nocircle.png" alt="logo img" style="width:20%;" > 

        <el-row :gutter="20" style="padding-left:5%;">
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloTutorial">
                    <div><img id="iconImg" src="@/assets/soloSelect-tutorial.png" alt="튜토리얼 img" style="width:60%"></div>
                    <div><img id="textImg" src="@/assets/text/solo_tutorial.png" alt="튜토리얼"></div>
                </el-card>  
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloSound" >
                    <div><img id="iconImg" src="@/assets/soloSelect-sound.png" alt="소리내기 img" style="width:60%"></div>
                    <div><img id="textImg" src="@/assets/text/solo_sound.png" alt="소리내기"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" @click="moveSoloSong" >
                    <div><img id="iconImg" src="@/assets/soloSelect-song.png" alt="연주하기 img" style="width:80%;"></div>
                    <div><img id="textImg" src="@/assets/text/solo_song.png" alt="연주하기" style="padding-top:12%;"></div>

                </el-card>
            </el-col>
        </el-row>
        <!-- 이미지 방향은 놔두기 playroom branch 에서 수정함 -->
        <div @click="goback">
            <div style="width:20%; position: fixed; bottom:2%; left:8%; cursor: pointer;" >
                <img src="@/assets/goback.png" alt="돌아가기" style="width:15%; ">
                <span style="font-size:45px;"> 뒤로가기 </span>
            </div>
        </div>

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
            console.log('mode test')
            this.$router.push({ name: 'mode' })
        }
    },

}
</script>

<style>
.hover-button{
    cursor: pointer;
}


.el-card{
     /* border: 5px solid red; */
     width: 80%;
     height: 120%;
     display: flex;
     align-items: center;
     cursor: url(../../assets/cursor_click.png), auto !important;
     border-radius: 20px;
     background-color: #F2E6E6;
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

</style>