import { createApp , toRaw } from 'vue'
import { createPinia } from 'pinia'
//1.引入piniaPersist持久化插件
import piniaPersist from 'pinia-plugin-persist'
import './style.css'
import App from './App.vue'
import router from './router'
import { useMenuStore } from "./store/menu"
import PanelHead from './components/panelHead.vue'


// 路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  // 非登录页面且没有token
  if(!token && to.path !== '/login'){
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true //允许导航继续进行
  }
})

// 创建 pinia 实例
const pinia = createPinia()
//2.在Pinia中注册  piniaPersist
pinia.use(piniaPersist)

// 创建 app 实例
const app = createApp(App)
// element 图标引入 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局组件注册
app.component('PanelHead', PanelHead)
app.use(pinia)
const menuStore = useMenuStore()
// 刷新后的动态路由添加
const localData = localStorage.getItem('pz_v3pz')
if (localData) {
  menuStore.dynamicMenu(JSON.parse(localData).routerList)
  toRaw(menuStore.routerList).forEach(item => {
    // 向路由的main路由中添加子路由
    router.addRoute('main', item)  
  })
}

// router要在添加完路由之后引入，不然还没添加，路由已经生成了
app.use(router)
app.mount('#app')


