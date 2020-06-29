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

const { MathJax, $, kf, languageObject } = window
$.getScript('/cdn/kityformula-editor.all.js')

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
    const { value, onChange } = this.props
    this.factory = kf.EditorFactory.create(this.instance, {
      render: {
        fontsize: 40
      },
      resource: {
        path: 'resource/'
      }
    })
    const that = this
    this.factory.ready(function () {
      console.error('ready')
      that.kityformulaInstance = this
      that.loadMathJax(value || '\\placeholder')
    })

    this.factory.preview(function (latex) {
      if (latex.trim() === '\\placeholder') { //只有占位符时,清空预览区域
        latex = ''
      } else {
        latex = '\\(' + latex + '\\)'
      }
      onChange(latex)
      $('#preview-panel').text(latex)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
    })
  }
  componentWillUnmount() {
    this.factory = null
    this.instance = null
    this.factory = null
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
          <legend>{languageObject['公式预览']}</legend>
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


export default MathjaxEditor