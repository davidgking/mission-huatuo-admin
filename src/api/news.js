import request from '@/utils/request'

export function fecthList(query) {
  return request({
    url: '/news/fecthList',
    method: 'get',
    params: query
  })
}

export function deleteNews(id) {
  return request({
    url: '/news/delete/' + id,
    method: 'get'
  })
}

export function updateNews(data) {
  return request({
    url: '/news/save',
    method: 'post',
    data
  })
}

const News = {
  fecthList: fecthList,
  deleteNews: deleteNews,
  updateNews: updateNews
}

export default News
