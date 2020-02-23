const data = {
  'code': 20000,
  'data': {
    'total': 6,
    'items': [{
      'id': 101,
      'title': '请输入你的姓名',
      'answer': 'mock data',
      'enTitle': 'Please write your name',
      'type': 1,
      'require': 1
    }, {
      'id': 102,
      'title': '你两周内有到过湖北吗',
      'answer': [{
        enName: 'Yes',
        name: '是'
      }, {
        enName: 'No',
        name: '否'
      }],
      'enTitle': 'Have yuo went to Hubei between 2 weeks',
      'type': 3,
      'require': 1
    }, {
      'id': 103,
      'title': '你两周之外有到过湖北吗',
      'answer': [{
        enName: 'Yes',
        name: '是'
      }, {
        enName: 'No',
        name: '否'
      }],
      'enTitle': 'Have yuo went to Hubei before 2 weeks',
      'type': 3,
      'require': 1
    }, {
      'id': 104,
      'title': '你有以下哪几种症状',
      'answer': [{
        enName: 'Fashao',
        name: '发烧'
      }, {
        enName: 'Kesou',
        name: '咳嗽'
      }, {
        enName: 'Touyun',
        name: '头晕'
      }, {
        enName: 'Outu',
        name: '呕吐'
      }],
      'enTitle': 'Which problem',
      'type': 4,
      'require': 1
    }, {
      'id': 105,
      'title': '你将要选择哪一种办公方式',
      'answer': [{
        enName: 'At home',
        name: '在家办公'
      }, {
        enName: 'At office',
        name: '办公室'
      }, {
        enName: 'At KFC',
        name: '肯德基'
      }],
      'enTitle': 'Which place do you select',
      'type': 3,
      'require': 1
    }, {
      'id': 106,
      'title': '请对我们的服务提出建议',
      'answer': 'mock data',
      'enTitle': 'Some suggestions',
      'type': 2,
      'require': 0
    }]
  }
}

export default data
