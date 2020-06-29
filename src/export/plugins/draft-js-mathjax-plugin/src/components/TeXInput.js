import React from 'react'
import { Modal, Button, ModalBody, ModalFooter } from 'reactstrap'

// === Components === //
import MathjaxEditor from './../../../draftjs-js-mathjax-editor-plugin'

const _isAlpha = key => key.length === 1 &&
  /[a-z]/.test(key.toLowerCase())

function indent({ text, start, end }, unindent = false) {
  const nl0 = text.slice(0, start).split('\n').length - 1
  const nl1 = nl0 + (text.slice(start, end).split('\n').length - 1)
  let nStart = start
  let nEnd = end
  const nText = text
    .split('\n')
    .map((l, i) => {
      if (i < nl0 || i > nl1) { return l }
      if (!unindent) {
        if (i === nl0) { nStart += 2 }
        nEnd += 2
        return `  ${l}`
      }
      if (l.startsWith('  ')) {
        if (i === nl0) { nStart -= 2 }
        nEnd -= 2
        return l.slice(2)
      }
      if (l.startsWith(' ')) {
        if (i === nl0) { nStart -= 1 }
        nEnd -= 1
        return l.slice(1)
      }
      return l
    })
    .join('\n')
  return { text: nText, start: nStart, end: nEnd }
}

const closeDelim = {
  '{': '}',
  '(': ')',
  '[': ']',
  '|': '|'
}

class TeXInput extends React.Component {

  constructor(props) {
    super(props)
    const {
      onChange,
      caretPosFn
    } = props

    const pos = caretPosFn()
    this.state = {
      start: pos,
      end: pos
    }

    this.completionList = []
    this.index = 0

    this._onChange = () => onChange({
      teX: this.teXinput.value
    })

    this._onSelect = () => {
      const { selectionStart: start, selectionEnd: end } = this.teXinput
      this.setState({ start, end })
    }

    this._moveCaret = (offset, relatif = false) => {
      const { teX: value } = this.props
      const { start, end } = this.state

      if (start !== end) return

      let newOffset = relatif ? start + offset : offset
      if (newOffset < 0) {
        newOffset = 0
      } else if (newOffset > value.length) {
        newOffset = value.length
      }

      this.setState({ start: newOffset, end: newOffset })
    }

    this._insertText = (text, offset = 0) => {
      let { teX: value } = this.props
      let { start, end } = this.state
      value = value.slice(0, start) + text + value.slice(end)
      start += text.length + offset
      if (start < 0) {
        start = 0
      } else if (start > value.length) {
        start = value.length
      }
      end = start
      onChange({ teX: value })
      this.setState({ start, end })
    }

    this.onBlur = () => this.props.finishEdit()

    this.handleKey = this.handleKey.bind(this)
    this.onMathjaxChange = this.onMathjaxChange.bind(this)
  }

  onMathjaxChange(text) {
    const nextText = text.slice(2, text.length - 2)
    this.props.onChange({
      teX: nextText
    })
    this.setState({
      start: nextText.length, end: nextText.length
    })
  }
  callback = (event) => {
    const { type, text } = JSON.parse(event.data)
    if (type === 'return-current-latex') {
      const nextText = text.slice(2, text.length - 2)
      this.props.onChange({
        teX: nextText
      })
      this.setState({
        start: nextText.length, end: nextText.length
      })
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.teX !== nextProps.teX) {
      return true
    }
    return false
  }
  componentDidUpdate(prevProps, prevState) {
    const { start: s, end: e } = prevState
    const { start: ns, end: ne } = this.state
    if (s !== ns || e !== ne) {
      this.teXinput.setSelectionRange(ns, ne)
    }
  }

  handleKey(evt) {
    const { teX, finishEdit, onChange, displaystyle, completion } = this.props
    const { start, end } = this.state
    const inlineMode = displaystyle !== undefined
    const collapsed = start === end
    const cplDisable = completion.status === 'none'
    const key = evt.key

    if (!cplDisable && key !== 'Tab' && key !== 'Shift') {
      this.completionList = []
      this.index = 0
    }

    switch (key) {
      case '$': {
        if (inlineMode) {
          evt.preventDefault()
          onChange({ displaystyle: !displaystyle })
        }
        break
      }
      case 'Escape': {
        evt.preventDefault()
        finishEdit(1)
        break
      }
      case 'ArrowLeft': {
        const atBegin = collapsed && end === 0
        if (atBegin) {
          evt.preventDefault()
          finishEdit(0)
        }
        break
      }
      case 'ArrowRight': {
        const atEnd = collapsed && start === teX.length
        if (atEnd) {
          evt.preventDefault()
          finishEdit(1)
        }
        break
      }
      default:
        if (
          Object.prototype.hasOwnProperty
            .call(closeDelim, key)
        ) {
          // insertion d'un délimiteur
          evt.preventDefault()
          this._insertText(key + closeDelim[key], -1)
        } else if (
          !cplDisable && ((
            _isAlpha(key) &&
            completion.status === 'auto'
          ) || (
              key === 'Tab' &&
              this.completionList.length > 1
            ) || (
              completion.status === 'manual' &&
              evt.ctrlKey &&
              key === ' '
            ))
        ) {
          // completion
          this._handleCompletion(evt)
        } else if (key === 'Tab') {
          // gestion de l'indentation
          const lines = teX.split('\n')
          if (inlineMode || lines.length <= 1) {
            // pas d'indentation dans ce cas
            evt.preventDefault()
            finishEdit(evt.shiftKey ? 0 : 1)
          } else {
            const {
              text,
              start: ns,
              end: ne
            } = indent(
              { text: teX, start, end },
              evt.shiftKey,
            )
            evt.preventDefault()
            onChange({ teX: text })
            setTimeout(() => this.setState({
              start: ns,
              end: ne
            }), 0)
          }
        }
    }
  }

  _handleCompletion(evt) {
    const { completion, teX, onChange } = this.props
    const { start, end } = this.state
    const key = evt.key
    const prefix = completion.getLastTeXCommand(teX.slice(0, start))
    const pl = prefix.length
    const startCmd = start - pl
    const isAlpha = _isAlpha(key)
    let ns = start
    let offset

    if (!pl) { return }

    if (isAlpha || (evt.ctrlKey && key === ' ')) {
      this.completionList = completion.computeCompletionList(
        prefix + (isAlpha ? key : ''),
      )
    }

    const L = this.completionList.length
    if (L === 0) {
      return
    } else if (L === 1) {
      // une seule possibilité: insertion!
      this.index = 0
    } else if (key === 'Tab') {
      // Tab ou S-Tab: on circule...
      offset = evt.shiftKey ? -1 : 1
      this.index += offset
      this.index = (this.index === -1) ? L - 1 : this.index % L
    } else {
      // isAlpha est true et plusieurs completions possibles
      this.index = 0
      ns = isAlpha ? ns + 1 : ns // pour avancer après la lettre insérée le cas échéant
    }

    const cmd = this.completionList[this.index]
    const endCmd = startCmd + cmd.length
    const teXUpdated = teX.slice(0, startCmd) +
      cmd + teX.slice(end)
    ns = L === 1 ? endCmd : ns

    evt.preventDefault()
    onChange({ teX: teXUpdated })
    setTimeout(() => this.setState({
      start: ns,
      end: endCmd
    }), 0)
  }

  render() {
    const { teX } = this.props
    return (
      <Modal
        isOpen
        size="lg"
        style={{ maxWidth: '986px', width: '90%' }}
      >
        <ModalBody
          style={{ width: 984 }}
        >
          <MathjaxEditor value={teX} onChange={this.caonMathjaxChangellback} />
        </ModalBody>
        <ModalFooter>
          <p style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 10 }} onClick={this.onBlur}>Ok</Button>
            <Button>Cancel</Button>
          </p>
        </ModalFooter>
      </Modal>
    )
  }
}

export default TeXInput
