import React, { Component } from 'react'
import { noop } from 'lodash'
import CKEditor from 'ckeditor4-react'
import WithMathjaxDisplayed from '../hoc/WithMathjaxDisplayed'

const defaultConfig = {
  contentsCss: [
    'http://cdn.ckeditor.com/4.14.0/full-all/contents.css'
  ],
  mathJaxLib: '//cdncs.101.com/v0.1/static/dist_learningobjectives_editor/mubiao-static/lib/MathJax/MathJax.js?config=TeX-AMS-MML_SVG-full,local/local',
  width: 'auto',
  height: '300px',
  allowedContent: true,
  extraPlugins: 'mentions,emoji,basicstyles,undo,link,wysiwygarea,toolbar,mathjax',
  language: 'en',
  toolbarLocation: 'top',
  title: false
}

CKEditor.editorUrl = 'http://gcdncs.101.com/v0.1/static/dist_learningobjectives_editor/base-cdn/ckeditor4/ckeditor.js'

class RichInput extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { text, handleTextChange, config } = this.props
    const nextConfig = {
      ...defaultConfig,
      ...config
    }
    return (
      <CKEditor
        data={text}
        onChange={evt => {
          const nextText = evt.editor.getData()
          handleTextChange(nextText)
        }}
        config={nextConfig}
      >
      </CKEditor>
    )
  }
}
RichInput.defaultProps = {
  text: '',
  config: {},
  handleTextChange: noop
}

export default WithMathjaxDisplayed(RichInput)