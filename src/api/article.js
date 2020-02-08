import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/notify/fetchList',
    method: 'get',
    params: query
  })
}

export function saveNotify(data) {
  return request({
    url: '/notify/save',
    method: 'post',
    data
  })
}

export function deleteNotify(staffId) {
  return request({
    url: '/notify/delete/' + staffId,
    method: 'get'
  })
}

export function getStaffInfo(staffId) {
  return request({
    url: '/userInfo/getStaff/' + staffId,
    method: 'get'
  })
}
