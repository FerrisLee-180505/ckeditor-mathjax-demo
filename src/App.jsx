// === Components === //
import { Row, Col } from 'reactstrap'

import React from 'react'
import Markdown from 'react-markdown'
import EDSRichTextInput from './export'

// === Datas === //
import { mentions, hashtag } from './datas'

// === Icons === //
import BoldIcon from './export/icons/BoldIcon'
import SplitIcon from './export/icons/SplitIcon'
import CodeBlockIcon from './export/icons/CodeBlockIcon'
import HeaderIcon from './export/icons/HeaderIcon'
import ItalicIcon from './export/icons/ItalicIcon'
import OrderedListIcon from './export/icons/OrderedListIcon'
import UnderLineIcon from './export/icons/UnderLineIcon'
import UnorderedListIcon from './export/icons/UnorderedListIcon'
import StrikeThroughIcon from './export/icons/StrikeThroughIcon'



// === Styles === //
import './styles.css'


const initData = `# Fibonacci Sequence
In mathematics, the **Fibonacci numbers**, commonly denoted Fn, form a sequence, called the **Fibonacci sequence**.

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

const toolbarItems = [
  { label: <HeaderIcon />, style: 'header-one' },
  { label: <SplitIcon />, style: '' },
  { label: <UnorderedListIcon />, style: 'unordered-list-item' },
  { label: <OrderedListIcon />, style: 'ordered-list-item' },
  { label: <SplitIcon />, style: '' },
  { label: <CodeBlockIcon />, style: 'code-block' },
  { label: <SplitIcon />, style: '' },
  { label: <BoldIcon />, style: 'BOLD' },
  { label: <ItalicIcon />, style: 'ITALIC' },
  { label: <UnderLineIcon />, style: 'UNDERLINE' },
  { label: <StrikeThroughIcon />, style: 'STRIKETHROUGH' }
]

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
      <div>
        <Row style={{ margin: 0 }}>
          <Col md={6}>
            <EDSRichTextInput
              toolbarItems={toolbarItems}
              mentions={mentions}
              hashtag={hashtag}
              value={value}
              showBorder
              onChange={this.onChange}
              enableMentions
              enableHashTag
              enableMathjax
              toolbarPosition="bottom"
            />
          </Col>
          <Col md={6}>
            <Markdown source={value} style={{ padding: 14 }} className="eds-rich-text-renderer" />
          </Col>
        </Row>
        <Row style={{ margin: 0 }}>
          <Col md={12} style={{ backgroundColor: 'white', borderRadius: '4px', marginTop: '1rem', whiteSpace: 'pre-line', padding: '4px' }}>
            {value}
          </Col>
        </Row>
      </div>
    )
  }
}

export default App
