<template>
<div class="container">
    <el-row class="game-main-container">
        <el-col :span="22" class="game-main-note">
            문제 나오는 부분
        </el-col>
    </el-row>
    <el-row class="game-sub-container">
        <el-col :span="15" class="game-sub-my-cam">
            
        </el-col>
        <el-col :span="8" :offset="1" class="game-sub-info">
            <div class="game-sub-title">비 행 기</div>
            <div class="game-sub-img">
                <!-- 곡 이미지 배경 -->
                <div class="game-sub-song-info">
                    <h3 class="produce">작곡가 : Sarah Josepha Hale & John Roulstone</h3><br>
                    <h3 class="produce">작사가 : 윤석중</h3><br>
                    <!--곡 설명-->
                    <h3 class="descTitle">[곡 설명]</h3>
                    <p class="description">세 개의 음 도, 레, 미의 3음계로 되어있으며, 배우기 쉬운 노래이다.</p>
                </div>
            </div>
            <div class="game-sub-button">
                <el-button class="solo-analyze-button" @click="goSoloAnalize">분석</el-button>
                <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
            </div>
        </el-col>
    </el-row>
</div>
</template>
<script>
// import { axios }
export default {
    name: 'SoloSongMain',
    props: {
        msg: String
    },
    methods: {
        goSoloAnalize() {
            this.$router.push({ name: 'soloAnalize' })
        },
        goSolo() {
            this.$router.push({ name: 'solo' })
        }
    }
}
</script>
<style>
.container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.game-main-container{
    border: 1px solid green;
    height: 20%;
    width: 95%;
    margin-bottom: 10px;
    border-radius: 20px;
}

.game-sub-container{
    height: 70%;
    width : 95%;
}

.game-sub-my-cam{
    height: 100%;
    border: 1px solid blue;
    border-radius: 20px;
}

.game-sub-info{
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 20px;
    height: 100%;
}
.game-sub-title{
    font-size: 2rem;
    color: white;
    margin-top: 3vh;
    margin-bottom: 10px;
}
.game-sub-img{
    width: 90%;
    height: 60%;
    margin: auto;
    aspect-ratio: 4 / 3;
    background-image: url("../../assets/board.png");
    background-size: contain;
    background-repeat: no-repeat;
    border: 1px solid blue;
}
.game-sub-button{
    margin-top: 5vh;
}
.game-sub-song-info{
    border: 1px solid red;
    
    height: 100%;
    background-image: url("../../assets/game/song/airplane.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 10px;
    padding: 5px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.produce {
    margin-bottom: 0;
    margin-top: 3px;

}
.descTitle{
    margin-bottom: 0;
}
.description{
    margin-top: 0;
    margin-bottom:0;
}
</style>