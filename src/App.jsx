import React from 'react'
import Markdown from 'react-markdown'
import EDSRichTextInput from './export'

// === Datas === //
import { mentions, hashtag } from './datas'


const initData = 'this is a **apple** and[edmodo](http://new.edmodo.com),[math]a^2=1[/math]and[math]a^3=1[/math]and[math]a^4=1[/math]todo'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: initData
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(value) {
    console.log('value=', value)
    this.setState({ value })
  }

  render() {
    const { value } = this.state
    return (
      <div style={{ backgroundColor: '#eee', padding: 10 }}>
        <EDSRichTextInput
          mentions={mentions}
          hashtag={hashtag}
          value={value}
          onChange={this.onChange}
        />
        <p>
          <strong>MARKDOWN - HTML(Best to use EDSRichTextRenderer):</strong>
          <div style={{ backgroundColor: 'white', borderRadius: '4px', marginTop: '1rem', whiteSpace: 'pre', padding: '4px' }}>
            <Markdown source={value} className="eds-rich-text-renderer" />
          </div>

          <strong>DRAFT - MARKDOWN:</strong>
          <div style={{ backgroundColor: 'white', borderRadius: '4px', marginTop: '1rem', whiteSpace: 'pre-line', padding: '4px' }}>
            {value}
          </div>
        </p>
      </div>
    )
  }
}

export default App
