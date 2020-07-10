import {
  getDefaultKeyBinding,
  KeyBindingUtil,
  EditorState,
  // convertToRaw,
} from 'draft-js'

const { hasCommandModifier } = KeyBindingUtil

export const myKeyBindingFn = getEditorState => (e) => {
  // J'aurais préféré CTRL+$ que CTRL+M, mais cela semble
  // un peu compliqué car chrome gère mal e.key.
  // if (e.key === '$' && hasCommandModifier(e))
  if (e.keyCode === /* m */ 77 && hasCommandModifier(e)) {
    return 'insert-texblock'
  }
  if (e.key === /* $ */ '$' /* && hasCommandModifier(e)*/) {
    const c = getEditorState().getCurrentContent()
    const s = getEditorState().getSelection()
    if (!s.isCollapsed()) return 'insert-inlinetex'
    const bk = s.getStartKey()
    const b = c.getBlockForKey(bk)
    const offset = s.getStartOffset() - 1
    if (b.getText()[offset] === '\\') {
      return `insert-char-${e.key}`
    }
    return 'insert-inlinetex'
  }
  return getDefaultKeyBinding(e)
}

export function findInlineTeXEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'INLINETEX'
      )
    },
    callback,
  )
}

export function changeDecorator(editorState, decorator) {
  return EditorState.create({
    allowUndo: true,
    currentContent: editorState.getCurrentContent(),
    decorator,
    selection: editorState.getSelection()
  })
}
