import React, { Component } from 'react'
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js'
import './EDSRichTextInput.css'

class RichInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.editor = React.createRef()

    this.handleChange = this.handleChange.bind(this)
    this.focus = this.focus.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.mapKeyToEditorCommand = this.mapKeyToEditorCommand.bind(this)
  }

  handleChange(editorState) {
    this.setState({ editorState })
  }

  focus() {
    if (this.editor.current) this.editor.current.focus()
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      this.handleChange(newState)
      return 'handled'
    }

    return 'not-handled'
  }

  getBlockStyle(block) {
    switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
    }
  }

  mapKeyToEditorCommand(e) {
    const { editorState } = this.state

    switch (e.keyCode) {
    case 9: { // TAB
      const newEditorState = RichUtils.onTab(e, editorState, 4)

      if (newEditorState !== editorState) {
        this.handleChange(newEditorState)
      }
      return null
    }
    }
    return getDefaultKeyBinding(e)
  }
  render() {
    const styleMap = {
      CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
      }
    }
    const { editorState } = this.state
    return (
      <div className="DraftJsPlaygroundContainer-editor">
        <EDSRichTextInputControls editorState={editorState} onChange={this.handleChange} />
        <div className="RichEditor-editor" onClick={this.focus}>
          <Editor
            blockStyleFn={this.getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.handleChange}
            placeholder="Tell a story..."
            ref={this.editor}
            spellCheck={true}
          />
        </div>
      </div>
    )
  }
}

const EDSRichTextInputControls = ({ editorState, onChange }) => (
  <>
    <BlockStyleControls
      editorState={editorState}
      onToggle={blockType => {
        const newState = RichUtils.toggleBlockType(editorState, blockType)
        onChange(newState)
      }}
    />
    <InlineStyleControls
      editorState={editorState}
      onToggle={inlineStyle => {
        const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle)
        onChange(newState)
      }}
    />
  </>
)
function StyleButton({ onToggle, active, label, style }) {
  let className = 'RichEditor-styleButton'
  if (active) {
    className += ' RichEditor-activeButton'
  }

  return (
    <span
      className={className}
      onMouseDown={e => {
        e.preventDefault()
        onToggle(style)
      }}
    >
      {label}
    </span>
  )
}
const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
]
const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' }
]
function InlineStyleControls({ editorState, onToggle }) {
  const currentStyle = editorState.getCurrentInlineStyle()

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}
function BlockStyleControls({ editorState, onToggle }) {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}
export default RichInput