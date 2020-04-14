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
