import { EditorState, Modifier, RichUtils } from 'draft-js'

// === Constants === //
import { toUpper, endsWith } from 'lodash'
import DraftjsBlockConstants from './../../../constants/DraftjsBlockConstants'
import DraftjsCommandConstants from './../../../constants/DraftjsCommandConstants'
import DraftjsEditorChangeTypeConstants from './../../../constants/DraftjsEditorChangeTypeConstants'

// === Utils === //
import { getSelectionEntity, addNewLineWithoutStyle, isFocusOnEndOfBlock, getCurrentBlock } from './../../../utils/DraftJSUtil'

const toggleInlineStyleArray = ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH']

const createEdmodoPlugin = () => {
  return {
    initialize: () => { },
    keyBindingFn: function (e, { getEditorState }) {
      const editorState = getEditorState()
      const currentBlockType = RichUtils.getCurrentBlockType(editorState)
      if (e.keyCode === 9) { // TAB
        if (currentBlockType === DraftjsBlockConstants.CODE_BLOCK) {
          return DraftjsCommandConstants.CODE_BLOCK_TAB
        }
      } else if (e.keyCode === 13) { // Enter
        if (currentBlockType.includes('header')) {
          return DraftjsCommandConstants.RESET_TO_UNSTYLE
        }
        if (currentBlockType === DraftjsBlockConstants.CODE_BLOCK) {
          return DraftjsCommandConstants.ADD_NEWLINE
        }
      } else if (e.keyCode === 85) { // U
        // We don't support underline, so disable keyboard command for it
        return null
      } else if (e.keyCode === 37 || e.keyCode === 39) { // handle the left/right if selection in mathjax entity.
        const editorState = getEditorState()
        const entity = getSelectionEntity(editorState)
        const contentState = editorState.getCurrentContent()
        const currentEntity = contentState.getEntity(entity)
        if (currentEntity.get('type') === 'INLINETEX') {
          return 'handled'
        }
      }
    },
    handleKeyCommand: function (command, editorState) {
      const currentBlock = getCurrentBlock(editorState)
      const selection = editorState.getSelection()
      const type = RichUtils.getCurrentBlockType(editorState)
      // in 'code-block', user couldn't use any inline style
      if (type === DraftjsBlockConstants.CODE_BLOCK && toggleInlineStyleArray.includes(toUpper(command))) {
        return editorState
      }
      if (command === DraftjsCommandConstants.ADD_NEWLINE) {
        if (endsWith(currentBlock.getText(), '\n') && isFocusOnEndOfBlock(selection, currentBlock)) {
          // TODO: It is best to remove the end of the line in current code-block.
          const nextEditorState = addNewLineWithoutStyle(editorState)
          return nextEditorState
        } else {
          const nextEditorState = RichUtils.insertSoftNewline(editorState)
          return nextEditorState
        }
      } else if (command === DraftjsCommandConstants.RESET_TO_UNSTYLE) {
        const nextEditorState = addNewLineWithoutStyle(editorState)
        return nextEditorState
      } else if (command === DraftjsCommandConstants.CODE_BLOCK_TAB) {
        const contentState = editorState.getCurrentContent()
        const indentation = '    '
        let newContentState
        if (selection.isCollapsed()) {
          newContentState = Modifier.insertText(
            contentState,
            selection,
            indentation
          )
        } else {
          newContentState = Modifier.replaceText(
            contentState,
            selection,
            indentation
          )
        }
        return EditorState.push(
          editorState,
          newContentState,
          DraftjsEditorChangeTypeConstants.INSERT_CHARACTERS
        )
      }
      return editorState
    },
    blockRendererFn: function (block) {
      // console.log('edmodo blockRendererFn', block.toJS())
    }
  }
}

export default createEdmodoPlugin
