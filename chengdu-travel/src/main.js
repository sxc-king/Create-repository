/**
 * 应用入口：创建 Vue 根实例并挂载到页面
 * 挂载全局路由（router）与全局样式（index.css），渲染至 #app 节点
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import './index.css'

createApp(App).use(router).mount('#app')
