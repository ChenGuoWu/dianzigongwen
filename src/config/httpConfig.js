import axios from 'axios'
import store from '@/store/index.js'
import qs from 'qs'
import { Toast } from 'vant';
const http = {}
var instance = axios.create({
    timeout: 7000,
    baseURL: process.env.VUE_APP_BASE_API,
    validateStatus(status) {
        switch (status) {
            case 400:
                Toast('请求出错')
                break
            case 401:
                Toast('授权失败，请重新登录')
                return
            case 403:
                Toast('拒绝访问')
                break
            case 404:
                Toast('请求错误,未找到该资源')
                break
            case 500:
                Toast('服务端错误')
                break
        }
        return status >= 200 && status < 300
    }
})
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
        function(config) {
            // 展示loading
            store.commit('show_loading')
                // 请求头添加token
            if (store.state.userToken) {
                config.headers.token = store.state.userToken
            }
            return config
        },
        function(error) {
            return Promise.reject(error)
        }
    )
    // 响应拦截器即异常处理
instance.interceptors.response.use(
    response => {
        // 隐藏设置全局loading
        store.commit('hide_loading')
        if (response.data.code == 50000) {
            Toast(response.data.msg)
        }
        return response.data
    },
    err => {
        if (err && err.response) {} else {
            Toast('连接服务器失败')
        }
        return Promise.reject(err.response)
    }
)
http.get = function(url, options) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, options)
            .then(response => {
                if (response.code && response.code != 20000) {
                    Toast(response.msg === null ? '服务器异常' : response.msg)
                    return
                }
                if (response) {
                    resolve(response)
                } else {
                    reject(response.msg)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}
http.post = function(url, options) {
    return new Promise((resolve, reject) => {
        instance
            .post(url, qs.stringify(options))
            .then(response => {
                if (response.code === 20000) {
                    resolve(response)
                } else {
                    reject(response.message)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}

export default http