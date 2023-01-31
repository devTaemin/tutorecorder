<template>
    <el-row class="game-content-container">
        <el-col :span="15" class="game-content-cam-section">
            <el-col :span="6" class="game-content-others-cam">
                <el-button class="carousel-button" :icon="ArrowUpBold" @click="goPrev"></el-button>
                <el-carousel height="610px" indicator-position="none" direction="vertical" :autoplay="false" ref="myCarousel">
                    <el-carousel-item v-for="item in others.length" :key="item">
                        <div class="others-cam" v-for="cam in others[item-1].length" :key="cam">
                            {{ others[item-1][cam-1] }}
                        </div>
                    </el-carousel-item>
                </el-carousel>
                <el-button class="carousel-button" :icon="ArrowDownBold" @click="goNext"></el-button>
            </el-col>
            <el-col :span="18" class="game-content-my-cam">
                내 카메라 들어가는 곳
            </el-col>
        </el-col>
        <el-col :span="8" class="game-content-info">
            <div class="game-content-title">소리내기</div>
            <div class="game-content-target">
                <img id="board-image" src="../../assets/board.png" alt="">
            </div>
            <div class="game-content-button">
                <el-button class="multi-analyze-button" @click="goMultiAnalize">분석</el-button>
                <el-button class="multi-out-button" @click="goMulti">나가기</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'

export default {
    name: 'MultiSoundMain',
    components: {
    },
    props: {
        
    },
    data() {
        return {
            ArrowUpBold: ArrowUpBold,
            ArrowDownBold: ArrowDownBold,
            others: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]]
        }
    },
    methods: {
        // goMultiAnalize() {
        //     this.$router.push({ name: 'MultiAnalize' })
        // },
        // goMulti() {
        //     this.$router.push({ name: 'MultiRoom' })
        // }
        goNext() {
            this.$refs.myCarousel.next();
        },
        goPrev() {
            this.$refs.myCarousel.prev();
        }
    }
}
</script>

<style>
div{
    border: 1px solid red
}
.game-content-container{
    height: 100%;
}

.game-content-cam-section{
    margin: auto;
    height: 95%;
    border: 1px solid blue;
    border-radius: 20px;
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

.multi-analyze-button{
    background-color: #8684FF;
    color: white;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 18vh;
    height: 6vh;
    margin-right: 8vh;

}

.multi-out-button{
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
.carousel-button {
    width: 3vw;
    background-color: #F0CDCD;
    color: #6A6D71;
}
.el-carousel {
    width: 90%;
    overflow: hidden;
}
.el-carousel__item{
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
}

.others-cam {
    height: 20%;
    width: 100%;
    margin: 10px;
    background-color: #9fa1a4;
}
</style>