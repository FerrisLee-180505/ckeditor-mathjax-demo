import mergeDefault from '@gem-mine/cli-plugin-doc/docsify/defaults'

// 如果需要在文档站中渲染您的组件库，请引用并且挂载组件库到全局对象
import EDSRichTextInput, { HeaderIcon, SplitIcon, UnorderedListIcon, OrderedListIcon, CodeBlockIcon, BoldIcon, ItalicIcon, UnderLineIcon, StrikeThroughIcon } from '../src/export'
import { mentions } from '../src/datas'

window.EDSRichTextInput = EDSRichTextInput

// 用于mention的提示
window.mentions = mentions

// 自定义菜单
window.HeaderIcon = HeaderIcon
window.SplitIcon = SplitIcon
window.UnorderedListIcon = UnorderedListIcon
window.OrderedListIcon = OrderedListIcon
window.CodeBlockIcon = CodeBlockIcon
window.BoldIcon = BoldIcon
window.ItalicIcon = ItalicIcon
window.UnderLineIcon = UnderLineIcon
window.StrikeThroughIcon = StrikeThroughIcon

// docsify配置
window.$docsify = mergeDefault({
  name: '我的文档',
  repo: 'https://github.com',
  plugins: []
})
