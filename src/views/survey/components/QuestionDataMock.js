const data = {
  'code': 20000,
  'data': {
    'total': 6,
    'items': [{
      'id': 101,
      'title': '请输入你的姓名',
      'answer': 'mock data',
      'content': 'baseContent',
      'type': 1,
      'require': 1
    }, {
      'id': 102,
      'title': '你两周内有到过湖北吗',
      'answer': [{
        value: 1,
        name: '是'
      }, {
        value: 0,
        name: '否'
      }],
      'content': 'baseContent',
      'type': 3,
      'require': 1
    }, {
      'id': 103,
      'title': '你两周之外有到过湖北吗',
      'answer': [{
        value: 1,
        name: '是'
      }, {
        value: 0,
        name: '否'
      }],
      'content': 'baseContent',
      'type': 3,
      'require': 1
    }, {
      'id': 104,
      'title': '你有以下哪几种症状',
      'answer': [{
        value: 1,
        name: '发烧'
      }, {
        value: 2,
        name: '咳嗽'
      }, {
        value: 3,
        name: '头晕'
      }, {
        value: 4,
        name: '呕吐'
      }],
      'content': 'baseContent',
      'type': 4,
      'require': 1
    }, {
      'id': 105,
      'title': '你将要选择哪一种办公方式',
      'answer': [{
        value: 1,
        name: '在家办公'
      }, {
        value: 2,
        name: '办公室'
      }, {
        value: 2,
        name: '肯德基'
      }],
      'content': 'baseContent',
      'type': 3,
      'require': 1
    }, {
      'id': 106,
      'title': '请对我们的服务提出建议',
      'answer': 'mock data',
      'content': 'baseContent',
      'type': 2,
      'require': 0
    }]
  }
}

export default data
