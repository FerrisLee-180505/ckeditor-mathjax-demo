# Gem-Mine-Doc

## 概述

这是一个基于 [docsify](https://docsify.js.org/#/) 的文档编辑系统

特性
- 无需构建，写完文档直接发布
- 基于Markdown语法
- 容易使用并且轻量 (~19kB gzipped)
- 智能的全文搜索
- 提供多套主题
- 丰富的 API
- 支持 Emoji
- 兼容 IE10+
- 支持 SSR

在它的基础上

- 支持了`React`代码的实时预览和编辑功能
- Toc和搜索样式优化
- 加入构建系统

## 安装

本文档系统依赖 `@gem-mine/cli` 生成，请先安装 `@gem-mine/cli`

```shell
npm i @gem-mine/cli -g // 安装 gmc
gms create:doc // 为项目生成文档, 默认生成在当前项目的`docs`目录下
```

## 指令

```shell
npm run dev:doc // 开发预览
npm run build:doc // 输出文档，输出目录为`docs`
```

## 文档编写

`markdown`目录即为`docsify`的根目录，请根据官方文档编写`markdown`文件

请参考[官方文档](https://docsify.js.org/#/zh-cn/)

## 文档配置入口

入口为`markdown/config.js`

```js
import mergeDefault from '@gem-mine/cli-plugin-doc/docsify/defaults'

// 如果需要在文档站中渲染您的组件库，请引用并且挂载组件库到全局对象
// import App from '../src/App'

// window.AppDemo = App

// docsify配置
window.$docsify = mergeDefault({
  name: '我的文档',
  repo: 'https://github.com',
  plugins: []
})
```
