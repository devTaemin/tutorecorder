<template>
<div class="container">
    <el-row gutter="20" class="game-main-container">
        <el-col :span="24" class="game-main-note">
            문제 나오는 부분
        </el-col>
    </el-row>
    <el-row :gutter="20" class="game-sub-container">
        <el-col :span="16" class="game-sub-my-cam">
            내 카메라
        </el-col>
        <el-col :span="8" class="game-sub-info">
            <h3>곡제목</h3>
            <div class="game-sub-img">
                곡 이미지 들어갈 곳
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
<style scoped>
div {
    border: 1px solid red
}
.container{
    width: 95vw;
    height: 95vh;
}
.game-main-container{
    border: 1px solid green;
    height: 20%;
    width: 100%;
    display: inline-block;
}
.game-main-note{
    border: 2px solid orange;
    height: 100%;
}
.game-sub-container{
    border: 1px solid purple;
    height: 80%;
    width : 100%;
    display: inline-block;
}

.game-sub-my-cam{
    margin: auto;
    height: 90%;
    border: 1px solid blue;
}

.game-sub-info{
    border: 1px solid black;
    height: 90%;
}
.game-sub-img{
    height: 50%;
}

.game-sub-button{
    margin-top: 30px;
    height: 20%;
}
</style>