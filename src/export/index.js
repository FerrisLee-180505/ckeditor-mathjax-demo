import EDSRichTextInput from './component/EDSRichTextInput'

// === Icons === //
import BoldIcon from './icons/BoldIcon'
import SplitIcon from './icons/SplitIcon'
import CodeBlockIcon from './icons/CodeBlockIcon'
import HeaderIcon from './icons/HeaderIcon'
import ItalicIcon from './icons/ItalicIcon'
import OrderedListIcon from './icons/OrderedListIcon'
import UnderLineIcon from './icons/UnderLineIcon'
import UnorderedListIcon from './icons/UnorderedListIcon'
import StrikeThroughIcon from './icons/StrikeThroughIcon'

// === Plugins === //
import createMathjaxPlugin from './plugins/draft-js-mathjax-plugin/index'
import createEdmodoPlugin from './plugins/draft-js-edmodo-plugin/index'
import MarkdownEdmodoMathjax from './plugins/markdown-edmodo-mathjax/index'
import DraftjsJsMathjaxEditorPlugin from './plugins/draftjs-js-mathjax-editor-plugin/index'

// === Utils === //
import * as DraftJSUtil from './utils/DraftJSUtil'

export default EDSRichTextInput

export {
  BoldIcon,
  SplitIcon,
  CodeBlockIcon,
  HeaderIcon,
  ItalicIcon,
  OrderedListIcon,
  UnderLineIcon,
  UnorderedListIcon,
  StrikeThroughIcon,

  DraftjsJsMathjaxEditorPlugin,
  MarkdownEdmodoMathjax,
  createEdmodoPlugin,
  createMathjaxPlugin,

  DraftJSUtil
}