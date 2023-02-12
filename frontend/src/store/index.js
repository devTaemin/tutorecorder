import { createStore } from 'vuex'
import createVuexPersistedState from 'vuex-persistedstate'

export default createStore({
  plugins: [createVuexPersistedState()],

  state: {
    // Join Form
    myUserName: '',
    mySessionId: '',
    gameResult: '',

    // OpenVidu Objects
    OV: undefined,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    videoIndex: 0,
  },
  getters: {
    getMyUserName: function(state) {
      return state.myUserName
    },
    getMySessionId: function(state) {
      return state.mySessionId
    },
    getOV: function(state) {
      return state.OV;
    },
    getSession: function(state) {
      return state.session;
    },
    getMainStreamManager: function(state) {
      return state.mainStreamManager;
    },
    getPublisher: function(state) {
      return state.publisher;
    },
    getSubscribers: function(state) {
      return state.subscribers;
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
    INIT_OV: (state) => {
      state.OV = undefined
    },
    SET_OV: (state, payload) => {
      state.OV = payload
    },
    INIT_SESSION: (state) => {
      state.session = undefined
    },
    SET_SESSION: (state, payload) => {
      state.session = payload
    },
    INIT_MAIN_STREAM_MANAGER: (state) => {
      state.mainStreamManager = undefined
    },
    SET_MAIN_STREAM_MANAGER: (state, payload) => {
      state.mainStreamManager = payload
    },
    INIT_PUBLISHER: (state) => {
      state.publisher = undefined
    },
    SET_PUBLISHER: (state, payload) => {
      state.publisher = payload
    },
    INIT_SUBSCRIBERS: (state) => {
      state.subscribers = []
    },
    SET_SUBSCRIBERS: (state, payload) => {
      state.subscribers.push(payload)
    },
    DELETE_SUBSCRIBERS: (state, payload) => {
      state.subscribers.splice(payload, 1)
    },
    SAVE_GAME_RESULT: (state, payload) => {
      state.gameResult = payload
    },
    INIT_GAME_RESULT: (state) => {
      state.gameResult = ''
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
    },
    initGameResult: ({ commit }) => {
      commit('INIT_GAME_RESULT')
    }
    
  },
  modules: {
    
  }
})
