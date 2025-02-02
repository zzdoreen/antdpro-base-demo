/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/zzdoreen': {
      // 要代理的地址
      target: 'https://gitee.com',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },
    '/api': {
      target: 'https://api.uomg.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
    '/openapi': {
      target: 'http://openapi.turingapi.com',
      changeOrigin: true,
      pathRewrite: { '^/openapi': '/openapi' },
    }
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/v1': {
      target: 'http://8.140.175.191:6062/',
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' },
    },
  }
};
