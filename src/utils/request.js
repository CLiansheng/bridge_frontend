import axios from 'axios';

// 1. 创建 axios 实例
const service = axios.create({
  baseURL: 'http://你们后端的接口地址', // 替换为真实的后端基础URL
  timeout: 5000 // 请求超时时间
});

// 2. 请求拦截器
service.interceptors.request.use(
  config => {
    // 稍后我们会在这一步，把存起来的 Token 放到请求头里发送给后端
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  response => {
    // 这里可以统一拦截后端的报错，比如密码错误等
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;