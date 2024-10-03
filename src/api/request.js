/**
 * @Description: axios封装
 */
'use strict'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '/@/router'
import { useUserStore, useAppStore } from '/@/store'
import responseCode from './response.code'
let lastReqConfig;
const request = axios.create({
  baseURL: import.meta.env.VITE_PROXY_DOMAIN,
  withCredentials: false,
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
    // 'lang' : 'zh'
  }
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || useUserStore().token;
  if (token) {
    config.headers.auth = token
    // config.headers.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response => {
  useAppStore().SET_REFRESHTAB('') // 关闭刷新
  const { code, data, message } = response.data
  if (code == 200) {
    return Promise.resolve(data)
  } else {
    if (code == 401) {
      useUserStore().LOGOUT()
      router.push('/login')
    }
    return handleError({ response: { status: code / 1, message } })
  }
}, error => {
  return handleError(error)
})

// 错误处理
function handleError(error) {
  let message = ''
  if (error && error.response) {
    // message = responseCode[error.response.status] || error.message || ''
    message = error.response.message || responseCode[error.response.status] || error.message || ''
  }
  const isTimeout = message.includes('timeout')
  if (isTimeout) {
    message = '网络请求超时'
  }
  ElMessage({
    offset: 300,
    message,
    type: 'tips',
    duration: 2 * 1000
  })
  return Promise.reject(message)
}
// 封装请求方法
async function apiRequest(method, url, data = {}, config = {}) {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default request
