import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'

class RichInput extends Component {
  constructor(props) {
    super(props)
    this.dom = React.createRef()
  }

  render() {
    const { text, mentions, handleTextChange } = this.props
    const config = {
      toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'MathType', 'ChemType'],
      mention: mentions
    }
    return (
      <CKEditor
        editor={ClassicEditor}
        data={text}
        config={config}
        onChange={(evt, editor) => handleTextChange(editor.getData())}
      />
    )
  }
}

RichInput.defaultProps = {
  text: '',
  mentions: []
}

export default RichInput