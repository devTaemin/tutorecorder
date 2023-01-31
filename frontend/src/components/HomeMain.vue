<template>
  <div class="hello">
    <div style="width:80%; border:5px solid red; margin:auto; margin-top:5%;">
      <img src="../assets/logo.png" alt="logo img" style="width:50%;" > 
      
      <div @click="nameSetVisible=true" style="cursor:pointer;">
        <img src="../assets/star.png" alt="star img" style="height:24px;">
        <img src="../assets/start.png" alt="start img" style="width:10%;">
      </div>
    </div>


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
import { mapActions } from 'vuex'

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

  },
  methods: {
    ...mapActions(['setMyUserName']),

    setName: function() {
      if (this.userName !== '') {
        this.nameSetVisible=false
        this.setMyUserName(this.userName)
        this.$router.push({ name: 'mode' })
      }
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
