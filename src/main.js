// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//导入element UI
import ElementUI from 'element-ui'
//导入element UI 样式文件
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
//导入mintUI
// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'

//导入mui
import Mui from 'vue-awesome-mui';

Vue.use(Mui);
//导入iview UI
// import iView from 'iview';
// import 'iview/dist/styles/iview.css';
// Vue.use(iView);

//  引入font-awsome
import './assets/font-awesome/css/font-awesome.min.css'
//引入jQuery
import $ from './assets/jquery';
import './assets/jquery.cookie';
//  引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.prototype.$axios = axios;
// 设置axios可以携带cookie
// axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://119.3.39.150/Emes-YkdPda-Api'//公司服务器
// axios.defaults.baseURL = 'http://192.168.20.3/Emes-YkdPda-Api'//客户内网
// axios.defaults.baseURL = 'http://218.90.139.234:8090'; //客户外网
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.common['token'] = store.state.token
//引入打印插件
import Print from 'vue-print-nb'

Vue.use(Print)//注册打印插件

Vue.config.productionTip = false

/**
 *  每一次的请求加上token
 */
axios.interceptors.request.use(
  config => {
    /**
     *  请求带上token
     */
    if (localStorage.getItem('sassToken')) {
      let Token = JSON.parse(localStorage.getItem('sassToken')).Token
      let OpenId = JSON.parse(localStorage.getItem('sassToken')).OpenId
      config.data = config.data + `&Token=${Token}`
      config.data = config.data + `&OpenId=${OpenId}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
