# 带路由/数据流的组件脚手架

> 此文件会复制到引用项目中，作为面向用户的`README`, 请认真填写

## Example

```js
import getPageRoute from 'demoComponent'

export default {
  path: '/demox',
  // 子路由
  sub: {
    ...pageRoute({
      relativePath: 'demox',
      modelPrefix: 'xxx'
    })
  }
}
```

## API

### getPageRoute

获取路由配置，直接挂载到路由中

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|[**`option.relativePath`**]|`{string}`| '' |路由的相对路径|
|[**`option.modelPrefix`**]|`{string}`| '' |store前缀，主要用途防止命名冲突|
