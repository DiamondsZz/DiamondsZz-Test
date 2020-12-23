import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'

// api 配置

let timer = null

const onError = error => {
  if (error.response) {
    const status = error.response.status
    const message = error.response.statusText
    if (status === 403) {
      notification.error({ message: '禁止访问', description: message })
    }

    if (status === 404) {
      notification.error({ message: '未知资源', description: message })
    }

    if (status === 500) {
      notification.error({
        message: '服务器错误',
        description: message
      })
    }

    if (status === 401 && !timer) {
      timer = setTimeout(() => {
        notification.error({
          message: '未授权',
          description: '授权失败，请重新登录'
        })
        timer = null
      }, 500)
    }
    // 超时
    if (message.includes('timeout')) {
      notification.error({
        message: '网络请求超时',
        description: message
      })
    }
  }
  return Promise.reject(error)
}
const request = axios.create({

  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://42.192.194.227:8801/',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [
    function (data, headers) {
      const token = Vue.ss.get('AUTHORIZATION')
      if (token) {
        headers.Authorization = token
      }
      if (headers['Content-Type'] === 'multipart/form-data') {
        return data
      } else {
        return JSON.stringify(data)
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'development') {
      const { method } = config
      if (['post', 'put', 'patch'].includes(method)) {
      }
    }
    return config
  },
  error => {
    notification.error({
      message: '请求失败',
      description: '发送请求失败，请检查您的网络'
    })
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(res => {
  const jsonPattern = /application\/json/gi
  if (jsonPattern.test(res.headers['content-type'])) {
    return res.data
  } else {
    return res
  }
}, onError)

export default request
