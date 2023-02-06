<template>
    <div class="container">
        <el-row class="game-main-container">
            <el-col :span="22" class="game-main-note">
                문제 나오는 부분
            </el-col>
        </el-row>
        <el-row class="game-sub-container">
            <el-col :span="15" class="game-sub-cam-section">
                <el-col :span="6" class="game-content-others-cam">
                    <el-button class="carousel-button" :icon="ArrowUpBold" @click="goPrev"></el-button>
                    <div class="carousel" id="cam-carousel">
                        <div v-for="other in others" :key="other" class="caroursel-item">
                            <h3>{{ other }}</h3>
                        </div>
                    </div>
                    <el-button class="carousel-button" :icon="ArrowDownBold" @click="goNext"></el-button>
                </el-col>
                <el-col :span="18" class="game-content-my-cam">
                    내 카메라 들어가는 곳
                </el-col>
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
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'

export default {
    name: 'MultiSongMain',
    props: {
        msg: String
    },
    data() {
        return {
            ArrowUpBold: ArrowUpBold,
            ArrowDownBold: ArrowDownBold,
            others: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        }
    },
    methods: {
        // goSoloAnalize() {
        //     this.$router.push({ name: 'soloAnalize' })
        // },
        // goSolo() {
        //     this.$router.push({ name: 'solo' })
        // },
        goNext() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop += height; 
        },
        goPrev() {
            let height = document.getElementById('cam-carousel').clientHeight;
            document.getElementById('cam-carousel').scrollTop -= height; 
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

.game-sub-cam-section{
    height: 100%;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.374);
    height: 100%;
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
.game-content-others-cam{
    margin: auto;
    height: 100%;
    border: 1px solid orange;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.game-content-my-cam {
    margin: auto;
    height: 100%;
    border: 1px solid orange;
    border-radius: 20px;
}
.carousel-button {
    width: 3vw;
    background-color: #F0CDCD;
    color: #6A6D71;
    margin-top: 1vh;
    margin-bottom: 1vh;
    cursor: url(../../assets/cursor_click.png), auto !important;
}
#cam-carousel{
    width: 90%;
    height: 87%;
    overflow-y: auto;
    scroll-behavior: smooth;
}
#cam-carousel::-webkit-scrollbar{
    display:none;
}
.caroursel-item {
    height: 24.7%;
    width: 99%;
    background-color: #9fa1a4;
    overflow: hidden;
    border: 1px solid black;
    border-radius: 10px;
}
</style>