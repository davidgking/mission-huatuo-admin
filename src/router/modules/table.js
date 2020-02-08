/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/notify',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'notifyStaff',
  meta: {
    title: '信息通知',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      hidden: true,
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      hidden: true,
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'switch',
      component: () => import('@/views/notify/notifySwitch'),
      name: 'switch',
      meta: { title: '通知总开关', icon: 'lock' }
    },
    {
      path: 'staff',
      component: () => import('@/views/table/complex-table'),
      name: 'staff',
      meta: { title: '被通知人管理', icon: 'tab' }
    }
  ]
}
export default tableRouter
