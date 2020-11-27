export default {
  // 支持值为 Object 和 Array
  'POST /api/getMenu': {
    data: [
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        component: './Admin',
        authority: ['admin'],
        children: [
          {
            path: '/admin/sub-page',
            name: 'sub-page',
            icon: 'smile',
            component: './Welcome',
            authority: ['admin'],
          },
        ],
      },
      {
        name: 'list.table-list',
        icon: 'heart',
        path: '/list',
        component: './ListTableList',
      },
      {
        component: './404',
      },
    ]
  },
};