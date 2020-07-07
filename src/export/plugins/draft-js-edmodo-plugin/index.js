import { EditorState, Modifier, RichUtils, KeyBindingUtil } from 'draft-js'

// === Constants === //
import DraftjsBlockConstants from '../../constants/DraftjsBlockConstants'
import DraftjsEditorChangeTypeConstants from '../../constants/DraftjsEditorChangeTypeConstants'

// === Utils === //
import { getSelectionEntity, addNewLineWithoutStyle, isFocusOnEndOfBlock, getCurrentBlock } from '../../utils/DraftJSUtil'

const createEdmodoPlugin = () => {
  return {
    initialize: () => { },
    keyBindingFn: function (e, { getEditorState, setEditorState }) {
      const editorState = getEditorState()
      const currentBlock = getCurrentBlock(editorState)
      const selection = editorState.getSelection()
      const currentBlockType = RichUtils.getCurrentBlockType(editorState)

      let newEditorState = editorState
      if (e.keyCode === 9) { // TAB
        if (currentBlockType === DraftjsBlockConstants.CODE_BLOCK) {
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
          newEditorState = EditorState.push(
            editorState,
            newContentState,
            DraftjsEditorChangeTypeConstants.INSERT_CHARACTERS
          )
        }
      } else if (e.keyCode === 13) { // Enter
        if (currentBlockType.includes('header')) {
          newEditorState = addNewLineWithoutStyle(editorState)
        }
        if (currentBlockType === DraftjsBlockConstants.CODE_BLOCK) {
          if (!KeyBindingUtil.hasCommandModifier(e) && isFocusOnEndOfBlock(selection, currentBlock)) {
            // TODO: It is best to remove the end of the line in current code-block.
            newEditorState = addNewLineWithoutStyle(editorState)
          } else {
            newEditorState = RichUtils.insertSoftNewline(editorState)
          }
        }
      } else if (e.keyCode === 85) { // U
        // We don't support underline, so disable keyboard command for it
        return null
      } else if (e.keyCode === 37 || e.keyCode === 39) { // handle the left/right if selection in mathjax entity.
        const entity = getSelectionEntity(editorState)
        const contentState = editorState.getCurrentContent()
        const currentEntity = contentState.getEntity(entity)
        if (currentEntity.get('type') === 'INLINETEX') {
          return 'handled'
        }
      }
      if (newEditorState !== editorState) {
        setEditorState(newEditorState)
        return 'handled'
      }
    }
  }
}

export default createEdmodoPlugin
