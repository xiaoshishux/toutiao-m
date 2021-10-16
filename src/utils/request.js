/**
 * 封装 axios 请求模块
 */
 import axios from "axios";
 import jsonBig from "json-bigint";
 import store from "@/store";
 // 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store，和在组件中 this.$store 一个东西
 import router from "@/router";

 // axios.create 方法：复制一个 axios
 const request = axios.create({
   baseURL: "http://api-toutiao-web.itheima.net" // 基础路径
 })

 /**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
request.defaults.transformResponse = [
  function(data) {
    try {
      return jsonBig.parse(data);
    } catch (err) {
      return {};
    }
  }
];


 // 请求拦截器
 request.interceptors.request.use(
  function(config) {
    const {user} = store.state;
    // 如果用户已登录，统一给接口设置 token 信息
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    // 处理完之后一定要把 config 返回，否则请求就会停在这里
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
)

  // 响应拦截器

 export default request