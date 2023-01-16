import { requestConfirm, requestLogin } from "../common/api/accountAPI";
import { requestSignin } from "../common/api/accountAPI";

const state = {
  token: null,
  isLogin: false,
  signRegister: false,
};

const getters = {
  getToken: state => {
    return state.token;
  },
  getLogin: state => {
    return state.isLogin
  },
  getSignRegister: state => {
    return state.signRegister
  },
};

const mutations = {
  setToken: (state, token) => {
    state.token = token;
  },
  getLogin: (state) => {
    console.log(state.token);
    console.log(response);
  },
  logOutData: (state) => {
    state.token = null,
    state.isLogin = false
    window.location.href = '/'
    // window.location.reload(true)
  },
  logOutDataWithoutRefresh: (state) => {
    state.token = null,
    state.isLogin = false
  },
  logInData: (state) => {
    console.log('로그인됨');
    state.isLogin = true
  },
  signRegister: (state) => {
    state.signRegister = true
  },
  signRegisterFalse: (state) => {
    state.signRegister = false
  },
}

const actions = {
  loginAction: async ({ commit }, loginData) => {
    try {
      const response = await requestLogin(loginData);
      alert('로그인 성공');
      commit("logInData");
      commit("setToken", response.data.accessToken);
    } catch (error) {
      console.log(error.response.status);
      alert('잘못된 정보입니다.');
    }
  },
  signinAction: async ({ commit }, signinData) => {
    try {
      const response = await requestSignin(signinData);
      console.log(response);
      alert('회원가입이 완료되었습니다.');
    } catch (error) {
      alert('회원가입에 실패하였습니다.');
    }
  },

  confirmAction: async ({ commit,state }) => {
    try {
      const response = await requestConfirm(`Bearer ${state.token}`);
      console.log('로그인성공');
      commit("logInData")
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        console.log('세션이 유효하지 않습니다.');
        commit("logOutDataWithoutRefresh");
      } else if (error.response.status === 403) {
        console.log('접근 권한이 없습니다.');
      } else {
        console.log("서버 오류 입니다");
      }
    }

  },

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
