<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-my-cam">
            내 카메라
        </el-col>
        <el-col :span="8" class="game-content-info">
            <div class="game-content-title">소리내기</div>
            <div class="game-content-target">
                <img id="board-image" src="../../assets/board.png" alt="">
            </div>
            <div class="game-content-button">
                <el-button class="solo-analyze-button">분석</el-button>
                <el-button class="solo-out-button">나가기</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'SoloSoundMain',
    props: {
        msg: String
    }
}
</script>

<style>

.game-content-container{
    height: 100%;
}

.game-content-my-cam{
    margin: auto;
    height: 90%;
    border: 1px solid blue;
    border-radius: 20px;
}

.game-content-info{
    background-color: rgba(0, 0, 0, 0.374);
    height: 95%;
    margin-top: auto;
    margin-bottom: auto;
    border-radius: 20px;
    margin-right: 10px;
}

.game-content-target{
    height: 50%;
    width: 90%;
    margin: 0px auto;
}

.game-content-button{
    margin-top: 13vh;
}

#board-image{
    width: 100%;
    height: 100%;
}

.solo-analyze-button{
    background-color: #8684FF;
    color: white;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 18vh;
    height: 6vh;
    margin-right: 8vh;

}

.solo-out-button{
    background-color: #F0AFAF;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 18vh;
    height: 6vh;
}

.game-content-title{
    margin-top: 5vh;
    font-size: 7vh;
    margin-bottom: 5vh;
}
</style>