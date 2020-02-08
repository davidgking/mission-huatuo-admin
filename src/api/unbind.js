import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/userInfo/fecthList',
    method: 'get'
  })
}

export function unbind(appId, staffId) {
  return request({
    url: '/userInfo/delete/' + appId + '/' + staffId,
    method: 'get'
  })
}
