import mergeDefault from '@gem-mine/cli-plugin-doc/docsify/defaults'

// 如果需要在文档站中渲染您的组件库，请引用并且挂载组件库到全局对象
import RichInput from '../src/export'
import mentions from '../mock/data/mentions'
import topics from '../mock/data/topics'
import MathjaxViewer from '../src/export/component/MathjaxViewer'
// import window.ClassicEditor
import './../public/lib/ckeditor5/build/ckeditor'

window.RichInput = RichInput
window.mentions = mentions
window.topics = topics
window.MathjaxViewer = MathjaxViewer

// docsify配置
window.$docsify = mergeDefault({
  name: 'Document',
  repo: 'https://github.com/FerrisLee-180505/ckeditor-mathjax-demo',
  plugins: []
})
