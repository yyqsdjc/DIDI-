import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'

const app = createApp(App)

// 在实例上绑定属性，组件内可以直接使用
app.config.globalProperties.$api = api

// 路由守卫
router.beforeEach((to, from) => {
  if(to.path !== '/login'){
    if(!localStorage.getItem('h5_token')){
      router.push('/login')
    }
  }
})

// 路由挂载
app.use(router)
app.mount('#app')
