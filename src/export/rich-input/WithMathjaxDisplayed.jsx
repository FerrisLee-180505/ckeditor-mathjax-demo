import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import refreshMathjax from './../utils/MathjaxUtils'

const WithMathjaxDisplayed = (EnhanceComponent) => {
  return class EnhancedMessage extends Component {
    constructor(props){
      super(props)
      this.dom = React.createRef()
    }
    componentDidMount() {
      this.renderMathJax()
    }
    componentDidUpdate() {
      this.renderMathJax()
    }
    renderMathJax() {
      /* eslint-disable react/no-find-dom-node */
      refreshMathjax(ReactDOM.findDOMNode(this.dom.current))
    }
    render() {
      return (
        <EnhanceComponent ref={this.dom} {...this.props} />
      )
    }
  }
}


export default WithMathjaxDisplayed