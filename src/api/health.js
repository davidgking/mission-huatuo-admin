import request from '@/utils/request'

const fetchList = function(query) {
  return request({
    url: '/healthHacn/fetchList',
    method: 'get',
    params: query
  })
}

const Health = {
  fetchList: fetchList
}

export default Health
