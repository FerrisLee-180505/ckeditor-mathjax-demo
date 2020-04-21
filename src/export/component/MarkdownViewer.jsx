import React, { Component } from 'react'
import Markdown from 'react-markdown'
import WithMathjaxDisplayed from '../hoc/WithMathjaxDisplayed'

class MarkdownViewer extends Component {
  render() {
    const { text } = this.props
    return (
      <Markdown
        escapeHtml={false}
        source={text}
      />
    )
  }
}
export default WithMathjaxDisplayed(MarkdownViewer)