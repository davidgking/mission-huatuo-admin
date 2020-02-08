import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/userInfo/fecthList',
    method: 'get',
    params: data
  })
}

export function unbind(appId, staffId) {
  return request({
    url: '/userInfo/delete/' + appId + '/' + staffId,
    method: 'get'
  })
}
