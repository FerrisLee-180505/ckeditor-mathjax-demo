import request from '@gem-mine/request'
import { config } from './proxy'

// 请求初始化
request.init(config, {
  // 开发模式下，如果某个域配置了 wds，则优先使用 wds 配置
  wds: process.env.NODE_ENV !== 'production',
  // 环境配置
  env: process.env.USE_MOCK ? 'mock' : 'defaults'
})

// 全局设置，对所有请求生效
request.config({
  verify(data) {
    return data.status === 200
  }
})