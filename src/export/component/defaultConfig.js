import PropTypes from 'prop-types'

// === Utils === //
import { noop } from 'lodash'

// 默认工具栏配置
const defaultToolbar = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'StrikeThrough', style: 'STRIKETHROUGH' },
  { label: 'AddLink', style: 'add-link' }
]

// 工具栏展示位置标识
const toolbarPositionValues = ['top', 'bottom']

// 自定义块样式
const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through'
  }
}

// 组件props上默认值
const defaultProps = {

  className: '',

  toolbarItems: defaultToolbar,

  placeholder: 'Tell a story...',

  value: '',

  onChange: noop,

  showBorder: true,

  customStyleMap: {},

  // enable mention feature, Default false
  enableMentions: false,

  // enable hashtag feature, Default false
  enableHashTag: false,

  // enable mathjax feature, Default false
  enableMathjax: false,

  toolbarPosition: 'top',

  mentions: []
}

// 组件props上字段类型
const propTypes = {

  className: PropTypes.string,

  placeholder: PropTypes.string,

  value: PropTypes.any.isRequired,

  onChange: PropTypes.func.isRequired,

  showBorder: PropTypes.bool,

  customStyleMap: PropTypes.object,

  toolbar: PropTypes.array,

  enableMentions: PropTypes.bool,

  enableHashTag: PropTypes.bool,

  enableMathjax: PropTypes.bool,

  toolbarPosition: PropTypes.oneOf(['top', 'bottom']),

  mentions: PropTypes.array
}

export {
  styleMap,
  propTypes,
  defaultProps,
  defaultToolbar,
  toolbarPositionValues
}