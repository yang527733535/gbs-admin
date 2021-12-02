import axios from 'axios';
import { Message } from '@arco-design/web-react';

const ConfigBaseURL = 'http://117.50.173.128:10080/'; //默认路径，这里也可以使用env来判断环境

//使用create方法创建axios实例
export const Service = axios.create({
  timeout: 7000, // 请求超时时间
  baseURL: ConfigBaseURL,
  method: 'POST',
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8',
  // },
});
// 添加请求拦截器
Service.interceptors.request.use((config) => {
  // console.log(window.localStorage.getItem(token));
  // consolee
  // if (localStorage.getItem(token)) {
  //   config.headers['Authorization'] = localStorage.getItem(token);
  // }
  config.headers['Authorization'] = 'Bearer f1781f8d67837d083763b64483b67462'
  return config;
});
// 添加响应拦截器
Service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log('TCL: error', error);
    const msg = error.Message !== undefined ? error.Message : '';
    Message({
      message: '网络错误' + msg,
      type: 'error',
      duration: 3 * 1000,
    });
    return Promise.reject(error);
  }
);
