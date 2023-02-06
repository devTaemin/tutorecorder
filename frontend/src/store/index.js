import { createStore } from 'vuex'
import createVuexPersistedState from 'vuex-persistedstate'

export default createStore({
  plugins: [createVuexPersistedState()],

  state: {
    myUserName: '',
    mySessionId: '',
    gameResult: '',
  },
  getters: {
    getMyUserName: function(state) {
      return state.myUserName
    },
    getMySessionId: function(state) {
      return state.mySessionId
    }
  },
  mutations: {
    INIT_MY_USER_NAME: (state) => {
      state.myUserName = ''
    },
    SET_MY_USER_NAME: (state, payload) => {
      state.myUserName = payload
    },
    INIT_MY_SESSION_ID: (state) => {
      state.mySessionId = ''
    },
    SET_MY_SESSION_ID: (state, payload) => {
      state.mySessionId = payload
    },
    SAVE_GAME_RESULT: (state, payload) => {
      state.gameResult = payload
    }
  },
  actions: {
    initMyUserName: ({ commit }) => {
      commit('INIT_MY_USER_NAME')
    },
    setMyUserName: ({ commit }, payload) => {
      commit('SET_MY_USER_NAME', payload)
    },
    initMySessionId: ({ commit }) => {
      commit('INIT_MY_SESSION_ID')
    },
    setMySessionId: ({ commit }, payload) => {
      commit('SET_MY_SESSION_ID', payload)
    },
    saveGameResult: ({ commit }, payload) => {
      commit('SAVE_GAME_RESULT', payload)
    }
  },
  modules: {
  }
})
