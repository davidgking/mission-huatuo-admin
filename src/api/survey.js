import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/vue-element-admin/question/list',
    method: 'get',
    params: query
  })
}

export function getDetail(id) {
  return request({
    url: '/vue-element-admin/question/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteQue(data) {
  return request({
    url: '/vue-element-admin/question/delete',
    method: 'post',
    data
  })
}

export function createQue(data) {
  return request({
    url: '/vue-element-admin/question/create',
    method: 'post',
    data
  })
}

export function updateQue(data) {
  return request({
    url: '/vue-element-admin/question/update',
    method: 'post',
    data
  })
}

const Survey = {
  getList: getList,
  getDetail: getDetail,
  deleteQue: deleteQue,
  createQue: createQue,
  updateQue: updateQue
}

export default Survey
