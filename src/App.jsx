// === Components === //
import { Row, Col } from 'reactstrap'

import React from 'react'
import Markdown from 'react-markdown'
import EDSRichTextInput from './export'

// === Datas === //
import { mentions, hashtag } from './datas'

// === Icons === //
import BoldIcon from './export/icons/BoldIcon'
import LinkIcon from './export/icons/LinkIcon'
import SplitIcon from './export/icons/SplitIcon'
import CodeBlockIcon from './export/icons/CodeBlockIcon'
import HeaderIcon from './export/icons/HeaderIcon'
import ItalicIcon from './export/icons/ItalicIcon'
import OrderedListIcon from './export/icons/OrderedListIcon'
import UnderLineIcon from './export/icons/UnderLineIcon'
import UnorderedListIcon from './export/icons/UnorderedListIcon'
import StrikeThroughIcon from './export/icons/StrikeThroughIcon'

// === Constants === //
import DraftjsCommandConstants from './export/constants/DraftjsCommandConstants'

// === Styles === //
import './styles.css'

const initData = ' [math]x=\\frac {-b\\pm \\sqrt {{b}^{2}-4ac}} {2a} [/math] [math]\\left ( {x+a} \\right )^{2}=\\sum \\limits^{n}_{k=0} {\\left ( {^{n}_{k}} \\right ){x}^{k}{a}^{n-k}} [/math] '

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
  { label: <StrikeThroughIcon />, style: 'STRIKETHROUGH' },
  { label: <SplitIcon />, style: '' },
  { label: <LinkIcon />, style: DraftjsCommandConstants.ADD_LINK }
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
    this.setState({ value })
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <Row style={{ margin: 0, padding: 10 }}>
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
            />
          </Col>
          <Col md={6} style={{ backgroundColor: 'white', borderRadius: '4px', marginTop: '1rem', whiteSpace: 'pre-line', padding: '4px' }}>
            {`[${value}]`}
          </Col>
        </Row>
      </div>
    )
  }
}

export default App
