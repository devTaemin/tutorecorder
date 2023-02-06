<template>
    <div class="container">
        <el-row class="game-main-container">
            <el-col :span="22" class="game-main-note">
                문제 나오는 부분
            </el-col>
        </el-row>
        <el-row class="game-sub-container">
            <el-col :span="15" class="game-sub-my-cam">
                내 카메라
            </el-col>
            <el-col :span="8" :offset="1" class="game-sub-info">
                <div class="game-sub-title">곡 제목</div>
                <div class="game-sub-img">
                    <!-- 곡 이미지 들어갈 곳 -->
                </div>
                <div class="game-sub-button">
                    <el-button class="solo-analyze-button" @click="goMultiAnalize">분석</el-button>
                    <el-button class="solo-out-button" @click="goRoom">방으로</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name: 'MultiSongMain',
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
    margin-top: 3vh;
    margin-bottom: 10px;
}
.game-sub-img{
    width: 90%;
    margin: 0 auto;
    aspect-ratio: 4 / 3;
    background-image: url("../../assets/board.png");
    background-size: contain;
    background-repeat: no-repeat;
}

.game-sub-button{
    margin-top: 5vh;
}
</style>