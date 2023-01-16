<template>
  <el-row
    class="main-sidebar"
    :gutter="10"
    :style="{ 'width': width }">
    <div class="hide-on-small">
      <el-menu
        :default-active="String(state.activeIndex)"
        active-text-color="#ffd04b"
        class="el-menu-vertical-demo"
        @select="menuSelect">
        <el-menu-item v-for="(item, index) in state.menuItems" :key="index" :index="index.toString()">
          <i v-if="item.icon" :class="['ic', item.icon]"/>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-row>
</template>
<style>
.main-sidebar .el-menu {
  margin-top: 0;
  padding-left: 0;
}
.main-sidebar .hide-on-small {
  height: 100%;
}
.main-sidebar .hide-on-small .el-menu {
  height: 100%;
}
.main-sidebar .el-menu .el-menu-item {
  cursor: pointer;
  border-right: none;
}
.main-sidebar .el-menu .el-menu-item .ic {
  margin-right: 5px;
}
</style>
<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'

export default {
  name: 'main-header',
  props: {
    width: {
      type: String,
      default: '240px'
    }
  },

  setup() {
    const store = useStore()
    const router = useRouter()

    const state = reactive({
      searchValue: null,
      isLogin: computed(() => {
        return store.getters['accountStore/getLogin']
      }),
      menuItems: computed(() => {
        const MenuItems = store.getters['menuStore/getMenus']
        let keys = Object.keys(MenuItems)
        if(state.isLogin) {
          for (let i = 1; i < keys.length; ++i) {
            MenuItems[keys[i]].hidden = false;
          }
        } else {
          for (let i = 1; i < keys.length; ++i) {
            MenuItems[keys[i]].hidden = true;
          }
        }
        let menuArray = []
        for (let i = 0; i < keys.length; ++i) {
          if(!MenuItems[keys[i]].hidden){
            let menuObject = {}
            menuObject.icon = MenuItems[keys[i]].icon
            menuObject.title = MenuItems[keys[i]].name
            menuArray.push(menuObject)
          }
        }
        return menuArray
      }),
      activeIndex: computed(() => store.getters['menuStore/getActiveMenuIndex'])
    })

    if (state.activeIndex === -1) {
      state.activeIndex = 0
      store.commit('menuStore/setMenuActive', 0)
    }

    const menuSelect = function (param) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      store.commit('menuStore/setMenuActive', param)
      const MenuItems = store.getters['menuStore/getMenus']
      let keys = Object.keys(MenuItems)
      router.push({
        name: keys[param]
      })
      loading.close()
    }

    return { state, menuSelect }
  }

}
</script>
