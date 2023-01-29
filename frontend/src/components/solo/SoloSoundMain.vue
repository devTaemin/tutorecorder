<template>
    <el-row :gutter="20" class="game-content-container">
        <el-col :span="15" class="game-content-my-cam">
            내 카메라
        </el-col>
        <el-col :span="9" class="game-content-info">
            <h3>소리내기</h3>
            <div class="game-content-target">
                문제 나오는 부분
            </div>
            <div class="game-content-button">
                <el-button>분석</el-button>
                <el-button>나가기</el-button>
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
    border: 1px solid red;
}

.game-content-my-cam{
    margin: auto;
    height: 90%;
    border: 1px solid blue;
}

.game-content-info{
    border: 1px solid black;
}

.game-content-target{
    border: 1px solid black;
    height: 50vh;
}

.game-content-button{
    margin-top: 30px;
}
</style>