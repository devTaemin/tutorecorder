<template>
  <el-dialog custom-class="sign-dialog" title="회원가입" v-model="state.dialogVisible" @close="handleClose">
    <el-form :model="state.form" :rules="state.rules" ref="signinForm" :label-position="state.form.align" @keyup="isValid">
      <el-form-item prop="department" label="소속" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.department" autocomplete="off" placeholder="30자까지 입력가능합니다"></el-input>
      </el-form-item>
      <el-form-item prop="position" label="직책" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.position" autocomplete="off" placeholder="30자까지 입력가능합니다"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="이름" :label-width="state.formLabelWidth" >
        <el-input v-model="state.form.name" autocomplete="off" placeholder="30자까지 입력가능합니다"></el-input>
      </el-form-item>
      <el-form-item prop="id" label="아이디" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.id" autocomplete="off" placeholder="16자까지 입력가능합니다"></el-input>
        <el-button @click='idConfirm' >중복체크</el-button>
      </el-form-item>
      <el-form-item prop="password" label="비밀번호" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.password" autocomplete="off"  show-password placeholder="9~16글자, 영문+숫자+특수문자"></el-input>
      </el-form-item>
      <el-form-item prop="passwordcheck" label="비밀번호 확인" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.passwordcheck" autocomplete="off"  show-password placeholder="비밀번호 확인"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="clickSignin" v-bind:disabled="state.form.isformValid">가입하기</el-button>
        <el-button type="primary" @click="cancel">취소</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style>
.signin-dialog {
  width: 600px !important;
  height: 650px;
}
.signin-dialog .el-dialog__headerbtn {
  float: right;
}
.signin-dialog .el-form-item__content {
  margin-left: 0 !important;
  /* float: right; */
  width: 200px;
  display: inline-block;
}
.signin-dialog .el-form-item {
  margin-bottom: 20px;
}
.signin-dialog .el-form-item__error {
  font-size: 12px;
  color: red;
}
.signin-dialog .el-input__suffix {
  display: none;
}
.signin-dialog .el-dialog__footer {
  margin: 0 calc(50% - 80px);
  padding-top: 0;
  display: inline-block;
}
.signin-dialog .dialog-footer .el-button {
  width: 120px;
  margin: 10px;
}
</style>
<script>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElLoading } from 'element-plus'
import { requestConfirmId, requestSignin } from "../../../common/api/accountAPI";

export default {
  name: 'signin-dialog',
  data() {
    return {
      isForm : true,
    }
  },

  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {

    const store = useStore()
    // 마운드 이후 바인딩 될 예정 - 컨텍스트에 노출시켜야함. <return>
    const signinForm = ref(null)

    /*
      // Element UI Validator
      // rules의 객체 키 값과 form의 객체 키 값이 같아야 매칭되어 적용됨
      //
    */
    const state = reactive({
      form: {
        id: '',
        password: '',
        passwordcheck: '',
        department:'',
        position:'',
        name:'',
        align: 'left',
        isformValid: true,
        isidValid: false,
      },
      rules: {
        id: [
          { required: true, message: 'Please input ID', trigger: 'blur' },
          { maxLength:16,message:'최대 16자까지 입력가능합니다.',trigger:'blur'},
          {
            validator: (rule, value, callback) => {
              if (
                  state.form.isidValid == false
                ) {
                  callback(new Error('아이디 중복체크는 필수 입니다.'),
                  )
                }
              callback()
            },
            message: '아이디 중복체크는 필수 입니다.',
            trigger: 'blur',
          }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur'},
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
        },

        ],
        passwordcheck: [
          { required: true, message: '비밀번호를 다시한번 입력해주세요.', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              // console.log(value);
              if (value !== state.form.password) {
                callback(new Error('Please input same password.'))
              }
              callback()
            },
            message: 'Please input same password.',
            trigger: 'blur',
          },

        ],
        name: [
          { required: true, message: 'Please input name', trigger: 'blur' }
        ],
        position: [
          { required: false, message: 'Please input position', trigger: 'blur' }
        ],
        department: [
          { required: false, message: 'Please input department', trigger: 'blur' }
        ]
      },
      dialogVisible: computed(() => props.open),
      formLabelWidth: '120px',
    })


    onMounted(() => {
      // console.log(signinForm.value)
    })

    const clickSignin = function () {
      // 로그인 클릭 시 validate 체크 후 그 결과 값에 따라, 로그인 API 호출 또는 경고창 표시
      console.log('submit')
      const loading = ElLoading.service({
        target: document.querySelector('.sign-dialog'),
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      signinForm.value.validate(async (valid) => {
        console.log('확인');
        if (valid) {
          console.log('it is valid');
          try {
              const response = await requestSignin({ department: state.form.department, id: state.form.id, name: state.form.name, password: state.form.password, position: state.form.position });
              console.log(response);
              handleClose()
              loading.close()
              alert('회원가입이 완료되었습니다.')
            } catch (error) {
              alert('회원가입에 실패하였습니다.')
            }
            // await store.dispatch('accountStore/signinAction', { department: state.form.department, id: state.form.id, name: state.form.name, password: state.form.password, position: state.form.position })
          } else {
            alert('Validate error!')
          }
        });
      loading.close()
    }

    const handleClose = function () {
      state.form.id = ''
      state.form.password = ''
      state.form.department = ''
      state.form.position = ''
      state.form.name = ''
      state.form.passwordcheck = ''
      state.form.isformValid = true
      state.form.isidValid = false
      emit('closeSigninDialog')
    }

    const cancel = () => {
      handleClose()
    };

    const isValid = () => {
      signinForm.value.validate((valid) => {
        if (valid) {
          console.log(valid);
          state.form.isformValid = false
          return true
        } else {
          console.log(valid);
          return false
        }
      })
    }

    const idConfirm = async() => {
      console.log('idConfirm');
      try {
        const response = await requestConfirmId(state.form.id);
        console.log(response);
        console.log(response.status);
        state.form.isidValid = true
        isValid()
        alert('사용가능한 아이디 입니다.')
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status === 409) {
          alert('아이디가 중복되었습니다.')
        } else {
          alert('서버가 응답하지 않습니다.', error.status)
        }
      }
    }

    watch(() => state.form.id, (newValue, oldValue) => {
      state.form.isidValid = false
    })

    return { signinForm, state, clickSignin, handleClose, cancel, isValid, idConfirm}
  },

}
</script>
