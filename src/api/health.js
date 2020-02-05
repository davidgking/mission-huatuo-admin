import request from '@/utils/request'

const getHealth = function() {
  return request({
    url: '/api/health',
    method: 'get'
  })
}

const Health = {
  getHealth: getHealth
}

export default Health
