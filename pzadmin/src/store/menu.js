import { defineStore } from "pinia"
import { useRoute } from 'vue-router';
import { ref } from "vue"
//在state或者localStorage
export const useMenuStore = defineStore(
  'Menu',
  () => {
    // const localData = localStorage.getItem('pz_v3pz') ?? []
    const isCollapse = ref(false)
    const selectMenu = ref([])
    const routerList = ref([])
    const menuActive = ref('1-1')  // 从 store 中获取当前激活的菜单项

    const collapseMenu = () => {
      isCollapse.value = !isCollapse.value
    }

    const addMenu = (payload) => {
      // 对数据进行去重
      if (selectMenu.value.findIndex(item => item.path === payload.path) === -1) {
        selectMenu.value.push(payload)
      }
    }

    const closeMenu = (payload) => {
      // 找到点击数据的索引
      const index = selectMenu.value.findIndex(val => val.name === payload.name)
      // 通过索引删除数组指定元素
      selectMenu.value.splice(index, 1)
    }

    // 动态菜单
    const dynamicMenu = (payload) => {
      const modules = import.meta.glob('../views/**/**/*.vue')
      function routerSet(router) {
        router.forEach(route => {
          if (!route.children) {
            const url = `../views${route.meta.path}/index.vue`
            route.component = modules[url]
          } else {
            routerSet(route.children)
          }
        })
      }
      routerSet(payload)
      routerList.value = payload
    }

    const updateMenuActive = (payload) => {
      menuActive.value = payload
    }

    return {
      isCollapse,
      selectMenu,
      routerList,
      menuActive,
      collapseMenu,
      addMenu,
      closeMenu,
      dynamicMenu,
      updateMenuActive,
    }
  },
  { // 持久化
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'pz_v3pz',
          storage: localStorage,
        }
      ]
    }
  }
)

