<template>
    <div>
        <h1>{{ msg }}</h1>

        <el-row :gutter="18" justify="center">
            <el-col :span="6">
                <el-card shadow="hover" @click="openSoloTutorial" class="hover-button">
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

        <el-dialog v-model="opentutorial" width="90%" id="dialog-tutorial"><SoloTutorialView @close-tutorial="closeTutorial"/></el-dialog>
    </div>
</template>
<script>
import SoloTutorialView from '@/views/SoloTutorialView.vue'

export default {
    name: 'SoloMain',
    components: {
        SoloTutorialView,
    },
    props: {
        msg: String
    },
    data() {
        return{
            opentutorial: false
        }
    },
    methods: {
        openSoloTutorial: function() {
            this.opentutorial = !this.opentutorial
        },
        moveSoloSound: function() {
            this.$router.push({ name: 'soloSound' })
        },
        moveSoloSong: function() {
            this.$router.push({ name: 'soloSong' })
        },
        closeTutorial() {
            this.opentutorial = false
        }
    }

}
</script>

<style>
#dialog-tutorial{
    border-radius: 20px;
}
.hover-button{
    cursor: pointer;
}
</style>