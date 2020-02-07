import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/vue-element-admin/articles/list',
    method: 'get',
    params: query
  })
}

export function getDetail(id) {
  return request({
    url: '/vue-element-admin/articles/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteArticle(data) {
  return request({
    url: '/vue-element-admin/articles/delete',
    method: 'post',
    data
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/articles/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/articles/update',
    method: 'post',
    data
  })
}

export function updateState(data) {
  return request({
    url: '/vue-element-admin/articles/state',
    method: 'post',
    data
  })
}

const Articles = {
  getList: getList,
  getDetail: getDetail,
  deleteArticle: deleteArticle,
  createArticle: createArticle,
  updateArticle: updateArticle,
  updateState: updateState
}

export default Articles
