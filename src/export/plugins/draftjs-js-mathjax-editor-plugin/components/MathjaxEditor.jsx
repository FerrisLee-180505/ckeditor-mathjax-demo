import React, { Component } from 'react'
import PropTypes from 'prop-types'

// === Utils === //
import noop from 'lodash/noop'
import $ from 'jquery'

// === Styles === //
import './../styles/base.css'
import './../styles/ui.css'
import './../styles/ui.extension.css'
import './../styles/scrollbar.css'
import './../styles/icons.css'
import './../styles/main.css'

// === I18n === //
//TODO: 目前依据浏览器语言自动使用展示语言。
const language = navigator.language || navigator.userLanguage
require(`./../i18n/${language}/index.js`)

// 为了翻遍kityformular里的库使用jquery，所以对window上的对象进行赋值
window.jQuery = window.$ = $

// === Libs === //
require('../lib/kitygraph.all.js')
require('../lib/kity-formula-render.all.js')
require('../lib/kity-formula-parser.all.js')
require('../lib/kityformula-editor.all.js')


class MathjaxEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.factory = null
    this.instance = React.createRef()
    this.kityformulaInstance = null
    this.loadMathJax = this.loadMathJax.bind(this)
  }
  componentDidMount() {
    if (!window.kf || !window.kf.EditorFactory) {
      console.error('Dependency loading failed')
      return
    }
    const { value } = this.props
    this.factory = window.kf.EditorFactory.create(this.instance, {
      render: {
        fontsize: 40
      },
      resource: {
        path: 'http://gcdncs.101.com/v0.1/static/learningcar/CDN/lib/kityformula/dialogs/resource/'
      }
    })
    const that = this
    this.factory.ready(function () {
      that.kityformulaInstance = this
      that.loadMathJax(value || '\\placeholder')
    })

    this.factory.preview(this.preview)
  }

  preview = (latex) => {
    const { onChange } = this.props
    if (latex.trim() === '\\placeholder') { //只有占位符时,清空预览区域
      latex = ''
    } else {
      latex = '\\(' + latex + '\\)'
    }
    onChange(latex)
    $('#preview-panel').text(latex)
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
  }
  componentWillUnmount() {
    this.factory = null
    this.instance = null
    this.kityformulaInstance = null
  }
  loadMathJax(latex) {
    this.kityformulaInstance.execCommand('render', latex)
    this.kityformulaInstance.execCommand('focus')
    this.kityformulaInstance.execCommand('preview')
  }

  render() {
    return (
      <div className="kfEditorWrapper">
        <div ref={i => this.instance = i} className="kf-editor" />
        <fieldset id="preview-panel-wrap">
          <legend>{window.languageObject['公式预览']}</legend>
          <div id="preview-panel"></div>
        </fieldset>
      </div>
    )
  }
}

MathjaxEditor.propTypes = {
  // teX value
  value: PropTypes.string,

  // onChage function callback
  onChange: PropTypes.func.isRequired
}

MathjaxEditor.defaultProps = {

  value: '',

  onChange: noop
}

export default MathjaxEditor