import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../views/OpenViduTestView.vue')
  },
  {
    path: '/mode',
    name: 'mode',
    component: () => import(/* webpackChunkName: "mode" */ '../views/ModeView.vue')
  },
  {
    path: '/solo',
    name: 'solo',
    component: () => import(/* webpackChunkName: "solo" */ '../views/SoloView.vue')
  },
  {
    path: '/solo/sound',
    name: 'soloSound',
    component: () => import(/* webpackChunkName: "solo" */ '../views/SoloSoundView.vue')
  },
  {
    path: '/solo/fingering',
    name: 'soloFingering',
    component: () => import(/* webpackChunkName: "solo" */ '../views/SoloFingeringView.vue')
  },
  {
    path: '/solo/song',
    name: 'soloSong',
    component: () => import(/* webpackChunkName: "solo" */ '../views/SoloSongView.vue')
  },
  {
    path: '/playroom',
    name: 'playRoom',
    component: () => import(/* webpackChunkName: "solo" */ '../views/PlayRoomView.vue')
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
