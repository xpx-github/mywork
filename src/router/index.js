import Vue from 'vue'
import Router from 'vue-router'
//pda登录页面
import login from '../pages/login'
//PDA首页
import home from "../pages/home"
//PDA出库页面
import pick from '../pages/pick.vue'
//PDA入库页面
import putStorage from '../pages/putStorage'
//PDA退库页面
import retuenStorage from '../pages/returnStorage'
//PDA查询页面
import search from '../pages/search'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      component:login
    },
    {
      path: '/home',
      component:home,
    },
    {
      path:'/pick',
      component:pick
    },
    {
      path:'/putStorage',
      component:putStorage
    },
    {
      path:'/returnStorage',
      component:retuenStorage
    },
    {
      path:'/search',
      component:search
    }

  ]
})


