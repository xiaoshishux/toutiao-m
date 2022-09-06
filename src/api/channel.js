/**
 * 频道相关的请求模块
 */
import request from "@/utils/request"


/**
 * 获取所有的频道列表
 */
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels',
    })
}


/**
 * 获取所有的频道列表
 */
export const addUserChannels = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data
    })
}

/**
 * 删除用户指定频道
 */
export const deleteUserChannels = channelId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${channelId}`,
    })
}