<template>
    <div>
        <el-row :gutter="18" justify="center">
            <el-col :span="6">
                <el-card shadow="hover" @click="moveSoloPage">
                    <div>혼자하기</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" @click="roomEnterVisible=true">
                    <div>방들어가기</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" @click="roomMakeVisible=true">
                    <div>방만들기</div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog
            v-model="roomEnterVisible"
            title=""
            width="40%"
            class="tutorial-modal"
        >
            <el-form
                label-width="100px"
                style="max-width:500px"
            >
                <el-form-item label="방 코드 입력">
                    <el-input v-model="roomCode" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="roomEnterVisible=false">취소</el-button>
                <el-button type="success" @click="enterRoom">입장</el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="roomMakeVisible"
            title=""
            width="40%"
        >
            <el-form
                label-width="100px"
                style="max-width:500px"
            >
                <el-form-item label="방 코드 설정">
                    <el-input v-model="roomCode" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="roomMakeVisible=false">취소</el-button>
                <el-button type="success" @click="createRoom">생성</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'ModeMain',
    props: {
        msg: String,
    },
    data() {
        return {
            roomEnterVisible: false,
            roomMakeVisible: false,
            roomCode: '',
        }
    },
    computed: {

    },
    methods: {
        ...mapActions(['initMySessionId', 'setMySessionId']),

        moveSoloPage: function() {
            this.$router.push({ name: 'solo' })
        },
        enterRoom: function() {
            // 세션 코드 검사 후 예외 처리 (일치하는 방 정보 유무)
            // 방에 접속하는 코드
            this.setMySessionId(this.roomCode)

            console.log("방 입장");
            this.roomCode='';
            this.roomEnterVisible=false;

            // DEBUG

            this.$router.push({ name: 'test' })
        },
        createRoom: function() {
            // 방 생성
            this.setMySessionId(this.roomCode)

            console.log("방 생성");
            this.roomCode='';
            this.roomMakeVisible=false;

            // DEBUG


            this.$router.push({ name: 'test' })
        }

    }
}
</script>

<style>
.tutorial-modal{
    background-color: #F2E6E6;;
}
</style>