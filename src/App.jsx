import React from 'react'
import Markdown from 'react-markdown'
import EDSRichTextInput from './export'

// === Datas === //
import { mentions, hashtag } from './datas'


const initData = `# Fibonacci Sequence
In mathematics, the **Fibonacci numbers**, commonly denoted Fn, form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from 0 and 1
This post is about #computerenginerring and #algorithms. Please remember that the #1 thing to remember is to always test your code

this \\*\\*not markdown\\*\\* and \\*also not markdown\\*

This is a ruby implementation:
\`\`\`
def fib(n)
  first_num, second_num = [0, 1]
  (n - 1).times do
    first_num, second_num = second_num, first_num + second_num
  end
  # just pring the numbers
  puts first_num
end
\`\`\`
If you want to check all available implementations, please go to [my github](https://nasa.gov)

Things to pay close attention:
- The fibonnaci sequence starts in 0
- 1 is the only number in the sequence that repeats itself
- the reason for that is that 0 + 1 = 1
    - an indented item

For more info on the fibonacci sequence, please check:
https://en.wikipedia.org/wiki/Fibonacci_number`

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
