import React, { Component } from 'react'
import { isEmpty } from 'lodash'


console.log('ClassicEditor=', ClassicEditor)
class RichInput extends Component {
  constructor(props) {
    super(props)
    this.dom = React.createRef()
  }

  componentDidMount() {
    const { mentions } = this.props
    const config = {
      toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'MathType', 'ChemType'],
      mention: mentions
    }
    ClassicEditor
      .create(this.dom.current, config)
      .then(editor => {
        this.editor = editor

        if ('disabled' in this.props) {
          editor.isReadOnly = this.props.disabled
        }

        if (this.props.onInit) {
          this.props.onInit(editor)
        }

        const modelDocument = editor.model.document
        const viewDocument = editor.editing.view.document

        modelDocument.on('change:data', () => {
          /* istanbul ignore else */
          if (this.props.handleTextChange) {
            this.props.handleTextChange(editor.getData())
          }
        })

        viewDocument.on('focus', event => {
          /* istanbul ignore else */
          if (this.props.onFocus) {
            this.props.onFocus(event, editor)
          }
        })

        viewDocument.on('blur', event => {
          /* istanbul ignore else */
          if (this.props.onBlur) {
            this.props.onBlur(event, editor)
          }
        })
        const { text } = this.props
        if (!isEmpty(text)) {
          editor.setData(text)
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    return (<div ref={this.dom} />)
  }
}

RichInput.defaultProps = {
  text: '',
  mentions: []
}

export default RichInput