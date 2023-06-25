export default [

  // {
  //   path: '/welcome',
  //   name: 'welcome',
  //   icon: 'smile',
  //   component: './Welcome',
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  {
    path: '/',
    flatMenu: true,
    component: './GlobalWrapper',
    routes: [
      {
        path: '/',
        component: './RedirectRoot'
      },
      {
        name: 'list.table-list',
        icon: 'table',
        path: '/list',
        component: './Table',
      },
      {
        name: 'websocket',
        icon: 'sketch',
        path: '/websocket',
        component: './Websocket'
      },
    ]
  },

  {
    component: './404',
  },
];
