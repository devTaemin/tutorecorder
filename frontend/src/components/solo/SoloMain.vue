<template>
    <div>
        <h1>{{ msg }}</h1>

        <el-row :gutter="18" justify="center">
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloSound">
                    <div>소리내기 모드</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloFingering">
                    <div>운지법 모드</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloSong">
                    <div>기본곡 모드</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>


export default {
    name: 'SoloMain',
    props: {
        msg: String
    },
    methods: {
        moveSoloSound: function() {
            this.$router.push({ name: 'soloSound' })
        },
        moveSoloFingering: function() {
            this.$router.push({ name: 'soloFingering' })
        },
        moveSoloSong: function() {
            this.$router.push({ name: 'soloSong' })
        }
    }

}
</script>