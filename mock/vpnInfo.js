import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  let p_1 = {
    openId: 126711011+i,
    staffId: 45094401+i,
    location: '西安',
    internetISP: '中国电信 China Telecom',
    linkType: '共享 Shared',
    bandWidth: '100Mbps以上 above 100Mbps',
    vpnType: '中国大陆VPN CN VPN',
    hadRebootAdsl: '已经重启 YES',
    symptom: '无法登陆VPN Cannot login VPN',
    outlookSlow: 'Yes',
    jabberSlow: 'Yes',
    sametimeSlow: 'No',
    vcSlow: 'No',
    hasOthAppSlow: 'No',
    othSlowApp: '',
    hasSomeAppCantAccess: 'No',
    cantAccessApp: '',
    reporterStaffId: 45091201+i,
    sharepointSharedFolderSlow: 'Yes',
    havePc: '',
    haveToken: '',
    other: '',
    vpnLocal: '',
    vpnState: '',
    lastUpatetime: '2020-01-11'
  }
  List.push(Mock.mock(p_1))
}

export default [
  {
    url: '/vue-element-admin/vpnInfo/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

