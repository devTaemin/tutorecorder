<template>
  <el-dialog custom-class="login-dialog" title="로그인" v-model="state.dialogVisible" @close="handleClose" :show-close="true">
    <el-form :model="state.form" :rules="state.rules" ref="loginForm" :label-position="state.form.align" @keyup="isLoginValid">
      <el-form-item prop="id" label="아이디" :label-width="state.formLabelWidth" >
        <el-input v-model="state.form.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="비밀번호" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.password" autocomplete="off" show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="clickLogin" v-bind:disabled="state.form.isformValid">로그인</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style>

.login-dialog {
  width: 400px !important;
  height: 300px;
}
.login-dialog .el-dialog__headerbtn {
  float: right;
}
.login-dialog .el-form-item__content {
  margin-left: 0 !important;
  float: right;
  width: 200px;
  display: inline-block;
}
.login-dialog .el-form-item {
  margin-bottom: 20px;
}
.login-dialog .el-form-item__error {
  font-size: 12px;
  color: red;
}
.login-dialog .el-input__suffix {
  display: none;
}
.login-dialog .el-dialog__footer {
  margin: 0 calc(50% - 80px);
  padding-top: 0;
  display: inline-block;
}
.login-dialog .dialog-footer .el-button {
  width: 120px;
}

</style>

<script>
import { reactive, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElLoading } from 'element-plus'
import _Dialog from 'element-plus/lib/el-dialog'


export default {
  name: 'login-dialog',

  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore()
    // 마운드 이후 바인딩 될 예정 - 컨텍스트에 노출시켜야함. <return>
    const loginForm = ref(null)

    /*
      // Element UI Validator
      // rules의 객체 키 값과 form의 객체 키 값이 같아야 매칭되어 적용됨
      //
    */
    const state = reactive({
      form: {
        id: '',
        password: '',
        align: 'left',
        isformValid: true,
      },
      rules: {
        id: [
          { required: true, message: 'Please input ID', trigger: 'blur' },
          { maxLength:16,message:'최대 16자까지 입력가능합니다.',trigger:'blur'}
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { maxLength:16,message:'최대 16자까지 입력가능합니다.',trigger:'blur'},
          { minLength:9,message:'최소 9글자 입력해야합니다.',trigger:'blur'},
          {
            validator: (rule, value, callback) => {
              if (
                  !value.match('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
                ) {
                  callback(new Error('패스워드는 대문자 특수문자 숫자를 포함하여야 합니다.'),
                  )
                }
              callback()
            },
            message: '패스워드는 대문자 특수문자 숫자를 포함하여야 합니다.',
            trigger: 'blur',
        }
        ]
      },
      dialogVisible: computed(() => props.open),
      formLabelWidth: '120px'
    })

    onMounted(() => {
      // console.log(loginForm.value)
    })

    const clickLogin = function () {
      // 로그인 클릭 시 validate 체크 후 그 결과 값에 따라, 로그인 API 호출 또는 경고창 표시
      loginForm.value.validate(async (valid) => {
        if (valid) {
          console.log(valid);
          console.log('submit')
          emit('openFullScreen')
          const loading = ElLoading.service({
            target: document.querySelector('.login-dialog'),
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          await store.dispatch('accountStore/loginAction', { id: state.form.id, password: state.form.password })
          loading.close()
          console.log('accessToken ' + store.getters['accountStore/getToken'])
          if (store.getters['accountStore/getToken']) {
            handleClose()
          }
        } else {
          alert('Validate error!')
        }
      });
    }

    const handleClose = function () {
      state.form.id = ''
      state.form.password = ''
      state.form.isformValid = true
      emit('closeLoginDialog')
    }

    const isLoginValid = function () {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          console.log(valid);
          state.form.isformValid = false
        } else {
          console.log(valid);
        }
      });
    }

    return { loginForm, state, clickLogin, handleClose, isLoginValid }
  }
}
</script>
