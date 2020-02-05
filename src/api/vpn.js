import request from '@/utils/request'

const vpnState = function(data) {
  return request({
    url: '/api/vpn',
    method: 'post',
    data
  })
}

const vpnReport = function(data) {
  return request({
    url: '/api/vpn/report',
    method: 'post',
    data
  })
}

const testApi = function(data) {
  return request({
    url: '/api',
    method: 'post',
    data
  })
}

const VPN = {
  vpnState: vpnState,
  vpnReport: vpnReport,
  testApi: testApi
}

export default VPN
