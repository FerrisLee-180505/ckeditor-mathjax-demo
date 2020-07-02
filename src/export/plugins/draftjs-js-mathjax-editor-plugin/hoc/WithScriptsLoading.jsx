import React, { Component } from 'react'

// === Utils === //
import { map } from 'lodash'
import { sequence, scriptPromise } from './../utils/promise-utils'

function WithScriptsLoading(Embed, libArray = []) {
  return class WithScriptsLoadingHoc extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isLoaded: false
      }
    }
    componentDidMount() {
      sequence(map(libArray, lib => () => scriptPromise(lib))).then(() => {
        this.setState({
          isLoaded: true
        })
      })
    }

    render() {
      const { isLoaded } = this.state
      //TODO: 这里如果有个loading效果就更好了
      return isLoaded && <Embed {...this.props} />
    }
  }
}

export default WithScriptsLoading