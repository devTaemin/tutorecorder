<template>
  <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
    <li v-for="i in state.count" @click="clickConference(i)" class="infinite-list-item" :key="i" >
      <conference />
    </li>
  </ul>
</template>
<style>
.infinite-list {
  padding-left: 0;
  max-height: calc(100% - 35px);
}

@media (min-width: 701px) and (max-width: 1269px) {
  .infinite-list {
    min-width: 700px;
  }
}

@media (min-width: 1270px) {
  .infinite-list {
    min-width: 1021px;
  }
}

.infinite-list .infinite-list-item {
  min-width: 335px;
  max-width: 25%;
  display: inline-block;
  cursor: pointer;
}
</style>
<script>
import Conference from './components/conference'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'

export default {
  name: 'Home',

  components: {
    Conference
  },

  setup () {
    const router = useRouter()

    const state = reactive({
      count: 12
    })

    const load = function () {
      state.count += 4
    }

    const clickConference = function (id) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      router.push({
        name: 'conference-detail',
        params: {
          conferenceId: id
        }
      })
      loading.close()
    }

    return { state, load, clickConference }
  }
}
</script>
