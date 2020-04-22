import mergeDefault from '@gem-mine/cli-plugin-doc/docsify/defaults'

// 如果需要在文档站中渲染您的组件库，请引用并且挂载组件库到全局对象
import RichInput from '../src/export'
import MathjaxViewer from '../src/export/component/MathjaxViewer'
import MarkdownViewer from '../src/export/component/MarkdownViewer'
import mentions from '../mock/data/mentions'
import topics from '../mock/data/topics'
import { htmlToMarkdown, markdownToHtml } from './../src/export/utils/MarkdownUtils'

window.RichInput = RichInput
window.MathjaxViewer = MathjaxViewer
window.mentions = mentions
window.topics = topics
window.MarkdownViewer = MarkdownViewer
window.htmlToMarkdown = htmlToMarkdown
window.markdownToHtml = markdownToHtml

// docsify配置
window.$docsify = mergeDefault({
  name: 'Document',
  repo: 'https://github.com/FerrisLee-180505/ckeditor-mathjax-demo',
  plugins: []
})
