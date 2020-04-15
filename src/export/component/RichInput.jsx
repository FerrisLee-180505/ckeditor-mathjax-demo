import React, { Component } from 'react'
import { noop } from 'lodash'
import CKEditor from 'ckeditor4-react'
import WithMathjaxDisplayed from '../hoc/WithMathjaxDisplayed'


class RichInput extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    const { text, mentions, handleTextChange, width, height } = this.props
    return (
      <CKEditor
        data={text}
        onChange={evt => {
          const nextText = evt.editor.getData()
          handleTextChange(nextText)
        }}
        config={{
          contentsCss: [
            'http://cdn.ckeditor.com/4.14.0/full-all/contents.css'
          ],
          mathJaxLib: '//cdncs.101.com/v0.1/static/dist_learningobjectives_editor/mubiao-static/lib/MathJax/MathJax.js?config=TeX-AMS-MML_SVG-full,local/local',
          width,
          height,
          allowedContent: true,
          extraAllowedContent: '*(*);*{*}',
          extraPlugins: 'mathjax,mentions,emoji,basicstyles,undo,link,wysiwygarea,toolbar',
          enableContextMenu: false,
          fillEmptyBlocks: false,
          language: 'en',
          toolbarLocation: 'top',
          title: false,
          mentions
        }}
      >
      </CKEditor>
    )
  }
}
RichInput.defaultProps = {
  text: '',
  mentions: [],
  height: 300,
  width: 'auto',
  handleTextChange: noop
}

export default WithMathjaxDisplayed(RichInput)