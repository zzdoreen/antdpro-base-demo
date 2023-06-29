export default [
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
      {
        name: 'layout',
        icon: 'bulb',
        path: '/layout',
        component: './Layout'
      },
      {
        name: 'preview',
        icon: 'copy',
        path: '/preview',
        component: './Preview'
      },
      {
        name: 'video',
        icon: 'eye',
        path: '/video',
        component: './Video'
      },
      {
        name: 'map',
        icon: 'fire',
        path: '/map',
        component: './Map'
      }
    ]
  },

  {
    component: './404',
  },
];
