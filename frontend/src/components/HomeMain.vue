<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <el-button 
      type="success" 
      :icon="Check" 
      @click="nameSetVisible=true"
    >
    START</el-button>

    <el-dialog
      v-model="nameSetVisible"
      title=""
      width="40%"
    >
      <!-- 입력 칸 -->
      <el-form
        label-width="100px"
        style="max-width:300px"
      >
      <el-form-item label="Name">
        <el-input v-model="userName" />
      </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="nameSetVisible=false">취소</el-button>
        <el-button type="success" @click="setName">입장</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Check } from '@element-plus/icons-vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomeMain',
  props: {
    msg: String
  },
  data() {
    return {
      Check: Check,
      nameSetVisible: false,
      userName: '',
    }
  },
  computed: {
    ...mapState(['myUserName']),
  },
  methods: {
    ...mapActions(['setMyUserName']),

    setName: function() {
      this.nameSetVisible=false
      this.setMyUserName(this.userName)
      this.$router.push({ name: 'mode' })
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
