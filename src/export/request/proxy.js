/**
 * 注意，此文件被内部 node 代码使用，请勿使用 import/export 语法
 */
const { wdsProxySetting } = require('@gem-mine/request')

/**
 * 请求配置，格式为：
 * {
 *   [请求域集合的名称]: {
 *     [环境1]: {
 *       url: 请求地址,
 *       prefix: 请求前缀
 *     },
 *     [环境2]: {
 *       url: 请求地址,
 *       prefix: 请求前缀
 *     }
 *   },
 *   [另一个请求域集合的名称]: {}
 * }
 */
const config = {
  demo: {
    // 本地代理请求配置，修改 wds 配置需要重新 npm start
    wds: {
      url: 'http://gm.zmei.me',
      prefix: ''
    },
    mock: {
      prefix: '/demo'
    },
    defaults: {
      url: 'http://gm.zmei.me',
      prefix: ''
    }
  }
}

exports.config = config
exports.proxyConfig = wdsProxySetting(config)
