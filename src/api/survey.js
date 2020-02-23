import request from '@/utils/request'

export function diyList(query) {
  return request({
    url: '/vue-element-admin/diyform/list',
    method: 'get',
    params: query
  })
}

export function queList(query) {
  return request({
    url: '/vue-element-admin/question/list',
    method: 'get',
    params: query
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

export function deleteDiyform(data) {
  return request({
    url: '/vue-element-admin/diyform/delete',
    method: 'post',
    data
  })
}

export function createDiyform(data) {
  return request({
    url: '/vue-element-admin/diyform/create',
    method: 'post',
    data
  })
}

export function updateDiyform(data) {
  return request({
    url: '/vue-element-admin/diyform/update',
    method: 'post',
    data
  })
}

export function queryDiyform(data) {
  return request({
    url: '/vue-element-admin/diyform/query',
    method: 'post',
    data
  })
}

const Survey = {
  diyList: diyList,
  queList: queList,
  deleteQue: deleteQue,
  createQue: createQue,
  updateQue: updateQue,
  deleteDiyform: deleteDiyform,
  createDiyform: createDiyform,
  updateDiyform: updateDiyform,
  queryDiyform: queryDiyform
}

export default Survey
