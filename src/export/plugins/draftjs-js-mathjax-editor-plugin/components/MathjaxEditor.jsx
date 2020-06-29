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
import './../i18n/zh-cn/index'

const { MathJax, $, kf, languageObject } = window

console.log('languageObject', languageObject)
class MathjaxEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.factory = null
  }
  componentDidMount() {
    const { value, onChange } = this.props
    $.getScript('/cdn/kityformula-editor.all.js').done(function () {
      window.jQuery(function ($) {
        this.factory = kf.EditorFactory.create($('#kfEditorContainer')[0], {
          render: {
            fontsize: 40
          },
          resource: {
            path: 'resource/'
          }
        })
        this.factory.ready(function () {
          $('#tips').remove()
          window.kfe = this
          console.log('after=', window.kf, window.kfe)
          window.getLatexData = function () {
            const latex = kfe.execCommand('get.source')
            return latex
          }

          window.load = function (latex) {
            kfe.execCommand('render', latex)
            // kfe.execCommand('focus')
            kfe.execCommand('preview')
          }
          window.load(value || '\\placeholder')
        })

        this.factory.preview(function (latex) {
          if (latex.trim() === '\\placeholder') { //只有占位符时,清空预览区域
            latex = ''
          } else {
            latex = '\\(' + latex + '\\)'
          }
          onChange(latex)
          $('#preview-panel').text(latex)
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
        })
        setTimeout(function () {
          $('#tips').html(languageObject['公式编辑器仅支持IE9及以上版本的IE浏览器！'])
          $('#preview-panel-wrap legend').html(languageObject['公式预览'])
        }, 500)
      })
    })
  }

  render() {
    return (
      <div className="kfEditorWrapper">
        <div id="kfEditorContainer" className="kf-editor">
          <div id="tips" className="tips">
          </div>
        </div>
        <fieldset id="preview-panel-wrap">
          <legend></legend>
          <div id="preview-panel"></div>
        </fieldset>
      </div>
    )
  }
}


MathjaxEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

MathjaxEditor.defaultProps = {
  value: '',
  onChange: noop
}


export default MathjaxEditor