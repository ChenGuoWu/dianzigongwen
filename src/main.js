// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import ViewUI from 'view-design'
import store from './store'
import headerTitle from '@/components/header.vue'
import 'vant/lib/index.css';
// import 'view-design/dist/styles/iview.css';
import 'amfe-flexible/index.js';
import service from '@/config/httpConfig.js';
import 'view-design/dist/styles/iview.css';
import { Notify } from 'vant';
import { Tree } from 'view-design';
import { Dialog, Toast } from 'vant';
Vue.config.productionTip = false
Vue.prototype.$Notify = Notify
Vue.prototype.$Dialog = Dialog
Vue.prototype.$Toast = Toast
Vue.use(Vant)
import mixin from '@/common/mixins/params'
Vue.mixin(mixin)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 用一下
Vue.use(ViewUI);
// 注册全局标题头组件
Vue.component('header-title', headerTitle);
Vue.component('Tree', Tree);
// 注入全局混入

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

// 按钮自定义指令
Vue.directive('showBtn', {
    inserted: (el, binding) => {},
    update: (el, binding) => {
        el.style.display = 'none'
        let btnName = binding.value.name;
        try {
            binding.value.data.forEach((item, index) => {
                if (item.infoType === btnName) {
                    el.style.display = 'block'
                        // console.log(el.className)
                    if (item.infoValue.value && item.infoValue.value !== '') {
                        el.innerHTML = item.infoValue.value
                    }
                }
            })
        } catch (e) {
            //TODO handle the exception
        }
    },
})

// getUserInfo方法触发标识
window.once = true

// 提供返回接口
window.goBack = function(msg) {
    location.history.back(-1)
}

// ·······························以下为本地调试方法··········································
// 获取安卓user信息
// 2020年9月30日10:59:06  已办，待阅等测试便签
// window.getUserInfo = function(p) {
//     // 2020年11月17日08:49:05
//     // p = JSON.parse(p)
//     // document.write('')
//     getoatoken1({
//         username: p.userName,
//         password: p.passWord
//     }).then(msg => {
//         store.commit('Login_in', msg.data)
//         store.commit('set_token', msg.data.token)
//     })

//     // 去掉原生返回的带转义的字符\
//     // msg = msg.replace(/[\\]/g, '')
//     // msg = JSON.parse(msg)
//     // let info = msg
//     // store.commit('Login_in', msg)
//     // store.commit('set_token', msg.token)
// }

// var p = {
//     userName: 'yangxiaole',
//     passWord: 'yangxiaole@123'
// }

// window.getUserInfo(p)