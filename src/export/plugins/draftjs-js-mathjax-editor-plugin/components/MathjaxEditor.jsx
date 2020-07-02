import React, { Component } from 'react'
import PropTypes from 'prop-types'

// === Utils === //
import { noop } from 'lodash'

// === Styles === //
import './../styles/page.css'
import './../styles/base.css'
import './../styles/ui.css'
import './../styles/ui.extension.css'
import './../styles/scrollbar.css'
import './../styles/main.css'

// === I18n === //
import './../i18n/en/index'

// === Hocs === //
import WithScriptsLoading from './../hoc/WithScriptsLoading'

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
    const { value } = this.props
    this.factory = window.kf.EditorFactory.create(this.instance, {
      render: {
        fontsize: 40
      },
      resource: {
        path: 'resource/'
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
  onChange: PropTypes.func.isRequired,

  // displayed language
  language: PropTypes.string
}

MathjaxEditor.defaultProps = {

  language: navigator.language || navigator.userLanguage,

  value: '',

  onChange: noop
}



export default WithScriptsLoading(MathjaxEditor, [
  '/cdn/kitygraph.all.js',
  '/cdn/kity-formula-render.all.js',
  '/cdn/kity-formula-parser.all.js',
  '/cdn/kityformula-editor.all.js'
])