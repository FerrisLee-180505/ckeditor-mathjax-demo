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
      // 如果window.kf存在，则代表kityformular的库已载入，无需再次载入
      if (window.kf) {
        this.setState({
          isLoaded: true
        })
        return
      }
      sequence(map(libArray, lib => () => scriptPromise(lib))).then(() => {
        this.setState({
          isLoaded: true
        })
      })
    }
    componentWillUnmount() {
      this.setState({
        isLoaded: false
      })
    }

    render() {
      const { isLoaded } = this.state
      //TODO: 这里如果有个loading效果就更好了
      return isLoaded ? <Embed {...this.props} /> : <div style={{ height: 500 }} />
    }
  }
}

export default WithScriptsLoading