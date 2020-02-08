import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/notifySwitch/fecthList',
    method: 'get'
  })
}

export function saveNotify(data) {
  return request({
    url: '/notifySwitch/save',
    method: 'post',
    data
  })
}

export function deleteNotify(appId) {
  return request({
    url: '/notifySwitch/delete/' + appId,
    method: 'get'
  })
}
