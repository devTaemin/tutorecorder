<template>
    <div>
        <h1>{{ msg }}</h1>
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
                    <el-card shadow="hover" @click="createRoom">
                        <div>방만들기</div>
                    </el-card>
                </el-col>
            </el-row>

            <el-dialog
                v-model="roomEnterVisible"
                title=""
                width="40%"
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
                    <el-button @click="enterRoomCancel">취소</el-button>
                    <el-button type="success" @click="enterRoomConfirm">입장</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ModeMain',
    props: {
        msg: String,
    },
    components: {

    },
    data() {
        return {
            roomEnterVisible: false,
            roomCode: '',

        }
    },
    computed: {

    },
    methods: {
        moveSoloPage: function() {
            this.$router.push({ name: 'solo' })
        },
        enterRoomCancel: function() {
            this.roomEnterVisible = false;
            this.roomCode = '';
        },
        enterRoomConfirm: function() {
            this.$router.push('/playroom/#' + this.roomCode);
            this.roomCode 
        },
        createRoom: function() {
            this.$router.push({ name: 'playRoom' });
        }
    }
}
</script>