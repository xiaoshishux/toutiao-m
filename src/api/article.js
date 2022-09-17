/**
* 文章相关请求模块
*/
import request from '@/utils/request'


/**
* 获取文章列表
*/
export const getArticles = params => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}

/**
* 获取文章详细
*/
export const getArticleById = articleId => {
  return request({
    method: 'get',
    url: `/v1_0/articles/${articleId}`,
  })
}


/**
* 收藏文章
*/
export const addCollect = articleId => {
  return request({
    method: 'post',
    url: '/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}

/**
* 取消收藏文章
*/
export const deleteCollect = articleId => {
  return request({
    method: 'delete',
    url: `/v1_0/article/collections/${articleId}`,
  })
}

/**
* 点赞文章
*/
export const addLike = articleId => {
  return request({
    method: 'post',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
* 取消点赞文章
*/
export const deleteLike = articleId => {
  return request({
    method: 'delete',
    url: `/v1_0/article/likings/${articleId}`,
  })
}