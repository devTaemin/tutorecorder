// import Vue from "vue";
// import Vuex from "vuex";

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {

//   },
//   getters: {

//   },
//   mutations: {

//   },
//   actions: {

//   }
// })

import { createStore } from 'vuex'
import createVuexPersistedState from 'vuex-persistedstate'

export default createStore({
  plugins: [createVuexPersistedState()],

  state: {
    myUserName: '',
  },
  getters: {
    getMyUserName: function(state) {
      return state.myUserName
    }
  },
  mutations: {
    INIT_MY_USER_NAME: (state) => {
      state.myUserName = ''
    },
    SET_MY_USER_NAME: (state, payload) => {
      state.myUserName = payload
    }
  },
  actions: {
    setMyUserName: ({ commit }, payload) => {
      commit('SET_MY_USER_NAME', payload)
    }
  },
  modules: {
  }
})
