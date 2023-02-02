<template>
    <div>
        <el-row :gutter="18" justify="center">
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloTutorial" class="hover-button">
                    <div>튜토리얼 모드</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloSound" class="hover-button">
                    <div>소리내기 모드</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloSong" class="hover-button">
                    <div>기본곡 모드</div>
                </el-card>
            </el-col>
        </el-row>
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
        }
    },

}
</script>

<style>
.hover-button{
    cursor: pointer;
}
</style>