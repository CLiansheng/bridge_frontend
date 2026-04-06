import axios from 'axios';

// 1. 创建 axios 实例
const service = axios.create({
  baseURL: '/be', // 基础URL，所有接口都以/be开头
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 2. 请求拦截器
service.interceptors.request.use(
  config => {
    // 从本地存储获取token并添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  response => {
    // 直接返回响应数据
    return response.data;
  },
  error => {
    // 统一处理错误
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          // 这里可以添加跳转到登录页的逻辑
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求地址不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，无法连接到服务器');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

// API 调用函数
// 用户相关API
export const userApi = {
  // 注册
  register: (data) => service.post('/user/registry', data),
  
  // 邮箱密码登录
  login: (data) => service.post('/user/login', data),
  
  // 发送验证码
  sendEmailCode: (data) => service.post('/user/mail', data),
  
  // 登出
  logout: () => service.put('/user/logout'),
  
  // 查看用户信息
  getUserInfo: () => service.get('/user/info'),
  
  // 修改用户信息
  updateUserInfo: (data) => service.put('/user/update', data)
};

// 诊断相关API
export const diagnoseApi = {
  // 上传诊断图片
  uploadImages: (data) => service.post('/diagnose/task', data),
  
  // 上传诊断+压缩包
  uploadZip: (data) => service.post('/diagnose/task/zip', data),
  
  // 查看诊断任务状态
  getTaskStatus: (taskId) => service.get(`/diagnose/task/status?taskId=${taskId}`),
  
  // 查看诊断报告详情
  getTaskDetail: (taskId) => service.get(`/diagnose/task/${taskId}`),
  
  // 调用deepseek
  callDeepSeek: (data) => service.post('/diagnose/ds', data)
};

// 历史相关API
export const historyApi = {
  // 分页查询历史记录
  getHistoryPage: (data) => service.post('/history/page', data),
  
  // 查询单条历史记录
  getHistoryDetail: (taskId) => service.get(`/history/${taskId}`),
  
  // 删除单条历史记录
  deleteHistory: (taskId) => service.delete(`/history/${taskId}`)
};

// 导出默认和命名导出
export default service;
export const api = {
  user: userApi,
  diagnose: diagnoseApi,
  history: historyApi
};