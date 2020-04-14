import React, { Component } from 'react'
import RichInput from './RichInput'
import MathjaxViewer from './MathjaxViewer'

class RichInputWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: 'This is a <strong>math</strong> equation:<span class="math-tex">\\(\\left ( {x+a} \\right )^{2}=\\sum \\limits^{n}_{k=0} {\\left ( {^{n}_{k}} \\right ){x}^{k}{a}^{n-k}}\\)</span> and I like it.'
    }
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleTextChange(nextText) {
    this.setState({
      text: nextText
    })
  }
  render() {
    const { text } = this.state
    return (
      <>
        <RichInput text={text}
          handleTextChange={this.handleTextChange}
        />
        <p>{`${text}`}</p>
        <MathjaxViewer text={text} />
      </>
    )
  }
}

export default RichInputWrapper