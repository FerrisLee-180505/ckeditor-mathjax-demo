/* eslint-disable indent */
import React, { Component } from 'react'
import { Modifier, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import PropTypes from 'prop-types'

// === Utils === //
import { isEmpty, get, noop, trim } from 'lodash'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import { getCurrentBlock, addNewLineWithoutStyle, getSelectionEntity, findLinkEntities, getEntityRange, getSelectionText } from '../utils/DraftJSUtil'

// === Plugins === //
import createMathjaxPlugin from '../plugins/draft-js-mathjax-plugin/src/index'
import createEdmodoPlugin from '../plugins/draft-js-edmodo-plugin/src/index'
import MarkdownEdmodoMathjax from '../plugins/markdown-edmodo-mathjax/index'

// === Styles === //
import './EDSRichTextInput.css'
import 'bootstrap/dist/css/bootstrap.css'

// === Components === //
import EDSRichTextInputToolbar from './EDSRichTextInputToolbar'
import AddLinkModal from './AddLinkModal'
import EDSLinkItem from './EDSLinkItem'

// === Constants === //
import DraftjsBlockConstants from '../constants/DraftjsBlockConstants'
import DraftjsCommandConstants from '../constants/DraftjsCommandConstants'
import DraftjsEditorChangeTypeConstants from '../constants/DraftjsEditorChangeTypeConstants'


const defaultToolbar = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'StrikeThrough', style: 'STRIKETHROUGH' },
  { label: 'AddLink', style: 'add-link' }
]

const toggleBlockTypeArray = [
  DraftjsBlockConstants.ORDERED_LIST_ITEM,
  DraftjsBlockConstants.UNORDERED_LIST_ITEM,
  DraftjsBlockConstants.CODE_BLOCK,
  DraftjsBlockConstants.HEADER_ONE,
  DraftjsBlockConstants.HEADER_TWO,
  DraftjsBlockConstants.HEADER_THREE,
  DraftjsBlockConstants.HEADER_FOUR,
  DraftjsBlockConstants.HEADER_FIVE,
  DraftjsBlockConstants.HEADER_SIX,
  DraftjsBlockConstants.UNSTYLED
]
const toggleInlineStyleArray = ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH']

const mathjaxPlugin = createMathjaxPlugin()
const edmodoPlugin = createEdmodoPlugin()
const plugins = [
  mathjaxPlugin,
  edmodoPlugin
]

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through'
  }
}

const options = {
  preserveNewlines: true,
  entityItems: {
    INLINETEX: {
      open: function (entity) {
        console.log('entity start=', entity)
        if (!get(entity, 'data.teX', '')) return ''
        return '[math]' + trim(entity.data.teX)
      },

      close: function (entity) {

        console.log('entity end=', entity)
        if (!get(entity, 'data.teX', '')) return ''
        return '[/math]'
      }
    }
  },
  remarkablePlugins: [MarkdownEdmodoMathjax],
  blockEntities: {
    katex_open: function (item) {
      return {
        type: 'INLINETEX',
        mutability: 'IMMUTABLE',
        data: {
          teX: item.content,
          displaystyle: false
        }
      }
    }
  }
}

class EDSRichTextInput extends Component {
  constructor(props) {
    super(props)
    this.focus = this.focus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getBlockStyle = this.getBlockStyle.bind(this)
    this.handleAddLink = this.handleAddLink.bind(this)
    this.handleEditLink = this.handleEditLink.bind(this)
    this.blockRendererFn = this.blockRendererFn.bind(this)
    this.handlePastedText = this.handlePastedText.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.handleRemoveLink = this.handleRemoveLink.bind(this)
    this.createEditorState = this.createEditorState.bind(this)
    this.toggleAddLinkModal = this.toggleAddLinkModal.bind(this)
    this.handleToolbarClick = this.handleToolbarClick.bind(this)
    this.mapKeyToEditorCommand = this.mapKeyToEditorCommand.bind(this)

    const { value } = props
    const currentEditorState = this.createEditorState(value)
    this.state = {
      isAddLinkModalOpen: false,
      addLinkText: '',
      addLinkUrl: '',
      markdownValue: value,
      currentEditorState,
      currentEntity: getSelectionEntity(currentEditorState)
    }
  }

  componentDidUpdate() {
    const { value } = this.props
    const { markdownValue } = this.state
    // If parent component updates the markdown value, we need to create a new EditorState.
    // This can happen for example after a API call returns with the value that needs to be
    // inserted in the input
    if (value !== markdownValue) {
      this.setState({
        currentEditorState: this.createEditorState(value),
        markdownValue: value
      })
    }
  }
  createEditorState(value) {
    return isEmpty(value) ? EditorState.createEmpty() : EditorState.createWithContent(
      convertFromRaw(markdownToDraft(value, options)),
    )
  }
  focus() {
    // Hacky: Wait to focus the editor so we don't lose selection.
    setTimeout(() => {
      this.editor.focus()
    }, 50)
  }

  handleToolbarClick(blockType) {
    if (!blockType) return
    const { currentEditorState, currentEntity } = this.state
    const currentBlock = getCurrentBlock(currentEditorState)
    const contentState = currentEditorState.getCurrentContent()
    const selection = currentEditorState.getSelection()
    const selectionText = getSelectionText(currentEditorState)
    if (toggleBlockTypeArray.includes(blockType)) {
      let newEditorState = currentEditorState
      if (blockType === DraftjsBlockConstants.CODE_BLOCK && RichUtils.getCurrentBlockType(newEditorState) !== DraftjsBlockConstants.CODE_BLOCK) {
        // if current block hasn't texts, no need to add a new line.
        if (!currentBlock.getText()) {
          if (selectionText) {
            // Changed into 'code-block' add new line.
            newEditorState = addNewLineWithoutStyle(newEditorState)
          }
        } else {
          if (selectionText) {
            const newContentState = Modifier.splitBlock(contentState, selection)
            newEditorState = EditorState.push(
              newEditorState,
              newContentState.merge({
                selectionAfter: newContentState.getSelectionBefore()
              }),
              DraftjsEditorChangeTypeConstants.INSERT_CHARACTERS
            )
          }
          newEditorState = addNewLineWithoutStyle(newEditorState)
        }
        const currentInlineStyle = newEditorState.getCurrentInlineStyle()
        currentInlineStyle.forEach(inlineStyle => {
          newEditorState = RichUtils.toggleInlineStyle(newEditorState, inlineStyle)
        })
      }
      newEditorState = RichUtils.toggleBlockType(newEditorState, blockType)
      this.onChange(newEditorState)
    } else if (toggleInlineStyleArray.includes(blockType)) {
      const newEditorState = RichUtils.toggleInlineStyle(currentEditorState, blockType)
      this.onChange(newEditorState)
    } else if (blockType === DraftjsCommandConstants.ADD_LINK) {
      let url = ''
      let currentSelectText = ''
      const contentState = currentEditorState.getCurrentContent()

      if (currentEntity) {
        const entity = contentState.getEntity(currentEntity)
        const entityRange = getEntityRange(currentEditorState, currentEntity)
        currentSelectText = entityRange.text
        url = get(entity.get('data'), 'url', '')
      } else {
        currentSelectText = getSelectionText(currentEditorState)
      }
      this.handleEditLink({ decoratedText: currentSelectText, url })
    }

    // Focus on input again after click on toobar
    this.focus()
  }
  toggleAddLinkModal() {
    this.setState({ isAddLinkModalOpen: !this.state.isAddLinkModalOpen })
  }

  getBlockStyle(block) {
    switch (block.getType()) {
      case DraftjsBlockConstants.CODE_BLOCK:
        return 'RichEditor-pre'
      default:
        return null
    }
  }
  blockRendererFn(block) {
    const nextBlockStyle = mathjaxPlugin.blockRendererFn(block)
    return nextBlockStyle
  }
  onChange(nextEditorState) {
    const { onChange } = this.props
    const markdownValue = draftToMarkdown(convertToRaw(nextEditorState.getCurrentContent()), options)
    console.log('markdownValue=', markdownValue)
    this.setState({
      markdownValue,
      currentEditorState: nextEditorState,
      currentEntity: getSelectionEntity(nextEditorState)
    })
    onChange && onChange(markdownValue)
  }
  handleRemoveLink() {
    const { currentEditorState, currentEntity } = this.state
    let selection = currentEditorState.getSelection()
    if (currentEntity) {
      const entityRange = getEntityRange(currentEditorState, currentEntity)
      const isBackward = selection.getIsBackward()
      if (isBackward) {
        selection = selection.merge({
          anchorOffset: entityRange.end,
          focusOffset: entityRange.start
        })
      } else {
        selection = selection.merge({
          anchorOffset: entityRange.start,
          focusOffset: entityRange.end
        })
      }
      this.onChange(RichUtils.toggleLink(currentEditorState, selection, null))
    }
  }

  handleKeyCommand(command, editorState) {
    const nextState = edmodoPlugin.handleKeyCommand(command, editorState)
    if (nextState === editorState) {
      return RichUtils.handleKeyCommand(editorState, command)
    } else {
      this.onChange(nextState)
      return 'handled'
    }
  }
  handleEditLink({ decoratedText: text, url }) {
    this.setState({
      isAddLinkModalOpen: true,
      addLinkText: text,
      addLinkUrl: url
    })
  }
  mapKeyToEditorCommand(e) {
    const { currentEditorState } = this.state
    let nextCommand = ''

    nextCommand = edmodoPlugin.keyBindingFn(e, { getEditorState: () => currentEditorState })
    if (nextCommand) {
      return nextCommand
    }
    nextCommand = mathjaxPlugin.keyBindingFn(e, { getEditorState: () => currentEditorState })
    if (nextCommand) {
      return nextCommand
    }

    return nextCommand
  }

  handleAddLink(linkTitle, linkTarget) {
    const { currentEditorState } = this.state
    const { currentEntity } = this.state
    let selection = currentEditorState.getSelection()

    if (currentEntity) {
      const entityRange = getEntityRange(currentEditorState, currentEntity)
      const isBackward = selection.getIsBackward()
      if (isBackward) {
        selection = selection.merge({
          anchorOffset: entityRange.end,
          focusOffset: entityRange.start
        })
      } else {
        selection = selection.merge({
          anchorOffset: entityRange.start,
          focusOffset: entityRange.end
        })
      }
    }
    const entityKey = currentEditorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', {
        url: linkTarget
      })
      .getLastCreatedEntityKey()

    const contentState = Modifier.replaceText(
      currentEditorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      currentEditorState.getCurrentInlineStyle(),
      entityKey
    )
    let newEditorState = EditorState.push(
      currentEditorState,
      contentState,
      'insert-characters'
    )

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + linkTitle.length,
      focusOffset: selection.get('anchorOffset') + linkTitle.length
    })
    newEditorState = EditorState.acceptSelection(newEditorState, selection)

    this.setState({
      isAddLinkModalOpen: false,
      addLinkText: '',
      addLinkUrl: ''
    }, this.focus)
    this.onChange(EditorState.push(newEditorState, contentState, 'insert-characters'))
  }
  handlePastedText(text, html, editorState) {
    const currentBlock = getCurrentBlock(editorState)
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    if (currentBlock.getType() === DraftjsBlockConstants.CODE_BLOCK) {
      const newContentState = Modifier.replaceText(
        contentState,
        selection,
        text
      )
      this.onChange(EditorState.push(
        editorState,
        newContentState,
        DraftjsEditorChangeTypeConstants.INSERT_CHARACTERS
      ))
      return 'handled'
    }
    return 'not-handled'
  }
  render() {
    const { isAddLinkModalOpen, addLinkText, addLinkUrl, currentEditorState: editorState } = this.state
    const { toolbarItems } = this.props
    const hasFocus = editorState.getSelection().getHasFocus()
    const currentBlockType = RichUtils.getCurrentBlockType(editorState)
    const nextToolbarItems = toolbarItems.map(item => {
      const { style } = item
      if (style === DraftjsCommandConstants.ADD_LINK) {
        return {
          ...item,
          disabled: !hasFocus
        }
      }
      return {
        ...item,
        disabled: currentBlockType === DraftjsBlockConstants.CODE_BLOCK && toggleInlineStyleArray.includes(style)
      }
    })
    return (
      <div className="DraftEditor">
        <EDSRichTextInputToolbar
          editorState={editorState}
          toolbarItems={nextToolbarItems}
          handleClick={this.handleToolbarClick}
        />
        <Editor
          ref={(el) => {
            this.editor = el
          }}
          blockStyleFn={this.getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={this.onChange}
          decorators={[
            {
              strategy: findLinkEntities,
              component: EDSLinkItem,
              props: {
                onEdit: this.handleEditLink,
                onRemove: this.handleRemoveLink
              }
            }
          ]}
          plugins={plugins}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.mapKeyToEditorCommand}
          handlePastedText={this.handlePastedText}
        />
        <AddLinkModal
          defaultText={addLinkText}
          defaultUrl={addLinkUrl}
          onSubmit={this.handleAddLink}
          toggle={this.toggleAddLinkModal}
          isOpen={isAddLinkModalOpen}
        />
      </div>
    )
  }
}
EDSRichTextInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  showBorder: PropTypes.bool,
  customStyleMap: PropTypes.object,
  toolbar: PropTypes.array
}

EDSRichTextInput.defaultProps = {
  className: '',
  toolbarItems: defaultToolbar,
  placeholder: 'Tell a story...',
  value: '',
  onChange: noop,
  showBorder: true,
  customStyleMap: {}
}
export default EDSRichTextInput