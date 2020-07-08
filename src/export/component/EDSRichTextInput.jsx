import React, { Component } from 'react'
import Editor from 'draft-js-plugins-editor'
import { Modifier, EditorState, RichUtils, convertFromRaw } from 'draft-js'

// === Utils === //
import classnames from 'classnames'
import get from 'lodash/get'
import pick from 'lodash/pick'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import { appendPluginsArray, draftToMarkdown, markdownToDraft } from './../utils/PluginsUtils'
import { getCurrentBlock, addNewLineWithoutStyle, getSelectionEntity, findLinkEntities, getEntityRange, getSelectionText } from '../utils/DraftJSUtil'

// === Styles === //
import 'bootstrap/dist/css/bootstrap.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js-hashtag-plugin/lib/plugin.css'
import './EDSRichTextInput.css'

// === Components === //
import EDSRichTextInputToolbar from './EDSRichTextInputToolbar'
import AddLinkModal from './AddLinkModal'
import EDSLinkItem from './EDSLinkItem'

// === Constants === //
import DraftjsBlockConstants from '../constants/DraftjsBlockConstants'
import DraftjsCommandConstants from '../constants/DraftjsCommandConstants'
import DraftjsEditorChangeTypeConstants from '../constants/DraftjsEditorChangeTypeConstants'
import { toolbarPositionValues, styleMap, defaultProps, propTypes } from './defaultConfig'

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


class EDSRichTextInput extends Component {
  constructor(props) {
    super(props)
    this.focus = this.focus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getBlockStyle = this.getBlockStyle.bind(this)
    this.handleAddLink = this.handleAddLink.bind(this)
    this.handleEditLink = this.handleEditLink.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.handlePastedText = this.handlePastedText.bind(this)
    this.handleRemoveLink = this.handleRemoveLink.bind(this)
    this.createEditorState = this.createEditorState.bind(this)
    this.toggleAddLinkModal = this.toggleAddLinkModal.bind(this)
    this.handleToolbarClick = this.handleToolbarClick.bind(this)

    const { value } = props
    const currentEditorState = this.createEditorState(value)
    this.state = {
      isAddLinkModalOpen: false,
      addLinkText: '',
      addLinkUrl: '',
      markdownValue: value,
      currentEditorState,
      currentEntity: getSelectionEntity(currentEditorState),
      mentionFilterValue: ''
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
      convertFromRaw(markdownToDraft(value)),
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

  onChange(nextEditorState) {
    const { onChange } = this.props
    const markdownValue = draftToMarkdown(nextEditorState)
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

  handleEditLink({ decoratedText: text, url }) {
    this.setState({
      isAddLinkModalOpen: true,
      addLinkText: text,
      addLinkUrl: url
    })
  }

  handleAddLink(linkTitle, linkTarget) {
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

  onSearchChange = ({ value }) => {
    this.setState({
      mentionFilterValue: value
    })
  };

  shouldHidePlaceholder = () => {
    // If the user changes block type before entering any text,
    // we hide the
    const { currentEditorState } = this.state
    const contentState = currentEditorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== DraftjsBlockConstants.UNSTYLED) {
        return true
      }
    }
    return false
  }

  handlePastedText = (text, html, editorState) => {
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
    const { isAddLinkModalOpen, addLinkText, addLinkUrl, currentEditorState: editorState, mentionFilterValue } = this.state
    const { toolbarItems, mentions, toolbarPosition, showBorder, placeholder } = this.props
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
    const isToolbarOnTop = toolbarPosition === toolbarPositionValues[0]

    const displayMentions = defaultSuggestionsFilter(mentionFilterValue, mentions)

    // if enable mentions feature, push plugins
    const nextPlugins = appendPluginsArray(pick(this.props, ['enableHashTag', 'enableMathjax', 'enableMentions']))
    // 查找插件中 是否有mentionPlugin插件
    const MentionSuggestions = get(find(nextPlugins, plugin => plugin.MentionSuggestions), 'MentionSuggestions')
    return (
      <div className={classnames('DraftEditor', { 'DraftEditor-border': showBorder, 'DraftEditor-hidePlaceholder': this.shouldHidePlaceholder() })}>
        {
          isToolbarOnTop && (
            <EDSRichTextInputToolbar
              editorState={editorState}
              toolbarItems={nextToolbarItems}
              handleClick={this.handleToolbarClick}
            />
          )
        }
        <Editor
          ref={(el) => {
            this.editor = el
          }}
          placeholder={placeholder}
          blockStyleFn={this.getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={this.onChange}
          handlePastedText={this.handlePastedText}
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
          plugins={nextPlugins}
          handlePastedText={this.handlePastedText}
        />

        {
          MentionSuggestions && (
            <MentionSuggestions
              onSearchChange={this.onSearchChange}
              suggestions={displayMentions}
              onAddMention={this.onAddMention}
            />
          )
        }
        {
          !isToolbarOnTop && (
            <EDSRichTextInputToolbar
              editorState={editorState}
              toolbarItems={nextToolbarItems}
              handleClick={this.handleToolbarClick}
            />
          )
        }
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

EDSRichTextInput.propTypes = propTypes

EDSRichTextInput.defaultProps = defaultProps

export default EDSRichTextInput