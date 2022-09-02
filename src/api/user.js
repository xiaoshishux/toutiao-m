/**
 * 用户相关的请求模块
 */
import request from "@/utils/request"


/**
 * 用户登录
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    // 携带post的参数,data接收的参数其实就是表单数据
    data
  })
}


/**
 * 发送短信验证码
 */
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `/v1_0/sms/codes/${mobile}`
  })
}


/**
* 获取用户自己的信息
*/
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: 'v1_0/user/profile',
    // Headers:{
    //   // 注意：该接口需要授权才能访问
    // //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization:`Bearer ${store.state.user.token}`
    // }
  })
}


/**
* 获取用户频道列表
*/
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}

