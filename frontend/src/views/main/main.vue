<template>
  <el-container class="main-wrapper">
    <main-header
      :height="`70px`"
      @openLoginDialog="onOpenLoginDialog"
      @openSigninDialog="onOpenSigninDialog"
      />
    <el-container class="main-container">
      <el-aside class="hide-on-small" width="240px">
        <main-sidebar
          :width="`240px`"/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <main-footer :height="`110px`"/>
  </el-container>
  <login-dialog
  :open="loginDialogOpen"
  @closeLoginDialog="onCloseLoginDialog"/>
  <signin-dialog
    :open="signinDialogOpen"
    @closeSigninDialog="onCloseSigninDialog"/>
</template>
<style>
  @import "https://unpkg.com/element-plus/lib/theme-chalk/index.css";
  @import './main.css';
  @import '../../common/css/common.css';
  @import '../../common/css/element-plus.css';

</style>
<script>
import LoginDialog from './components/login-dialog'
import MainHeader from './components/main-header'
import MainSidebar from './components/main-sidebar'
import MainFooter from './components/main-footer'
import SigninDialog from './components/signin-dialog.vue'
import { ElLoading } from 'element-plus'



export default {
  name: 'Main',
  components: {
    MainHeader,
    MainSidebar,
    MainFooter,
    LoginDialog,
    SigninDialog,
  },

  data () {
    return {
      loginDialogOpen: false,
      signinDialogOpen: false,
      // fullscreenLoading: ref(false),
    }
  },
  methods: {
    onOpenLoginDialog () {
      this.loginDialogOpen = true
    },
    onCloseLoginDialog () {
      this.loginDialogOpen = false
    },
    onOpenSigninDialog () {
      this.signinDialogOpen = true
    },
    onCloseSigninDialog () {
      this.signinDialogOpen = false
    },
    async confirmLogin () {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      await this.$store.dispatch('accountStore/confirmAction')
      loading.close()
      console.log('accessToken ' + this.$store.getters['accountStore/getToken'])
    }
  },
  created() {
    this.confirmLogin()
  }

}
</script>
