import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Playroom from '../views/PlayRoomView.vue'

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
    component: () => import(/* webpackChunkName: "solo" */ '../views/solo/SoloView.vue')
  },
  {
    path: '/solo/sound',
    name: 'soloSound',
    component: () => import(/* webpackChunkName: "solo" */ '../views/solo/SoloSoundView.vue')
  },
  {
    path: '/solo/tutorial',
    name: 'soloTutorial',
    component: () => import(/* webpackChunkName: "solo" */ '../views/solo/SoloTutorialView.vue')
  },
  {
    path: '/solo/song',
    name: 'soloSong',
    component: () => import(/* webpackChunkName: "solo" */ '../views/solo/SoloSongView.vue')
  },
  {
    path: '/solo/analize',
    name: 'soloAnalize',
    component: () => import(/* webpackChunkName: "solo" */ '../views/solo/SoloAnalizeView.vue')
  },
  {
    path: '/playroom',
    name: 'playRoom',
    component: Playroom,
    // component: () => import(/* webpackChunkName: "play" */ '../views/PlayRoomView.vue')    
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
