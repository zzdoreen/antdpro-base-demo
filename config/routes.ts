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
        name: 'player',
        icon: 'eye',
        path: '/player',
        component: './Player'
      },
      {
        name: 'map',
        icon: 'fire',
        path: '/map',
        component: './Map'
      },
      {
        name: 'tmap',
        icon: 'fire',
        path: '/tmap',
        component: './TMap'
      },
      {
        name: 'echarts',
        icon: 'code',
        path: '/echarts',
        component: './Echarts'
      },
      /*  {
         name: 'three',
         icon: 'sketch',
         path: '/three',
         component: './Three'
       }, */
      {
        name: 'less',
        icon: 'sketch',
        path: '/less',
        component: './Less'
      },
      {
        name: 'music',
        icon: 'bug',
        path: '/music',
        component: './Music'
      },
      {
        name: 'turing',
        icon: 'robot',
        path: '/turing',
        component: './Turing'
      }
    ]
  },

  {
    component: './404',
  },
];
