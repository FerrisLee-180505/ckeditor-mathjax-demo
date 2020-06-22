/**
* Collection of util functions to be used with draftjs.
* A lot of these util functions are from https://github.com/jpuri/draftjs-utils/
*/

import {
  EditorState,
  genKey,
  ContentBlock
} from 'draft-js'
import { List } from 'immutable'

// --- Constants --- //
import DraftjsEditorChangeTypeConstants from './../constants/DraftjsBlockConstants'

/**
 * Function returns collection of currently selected blocks.
 */
function getSelectedBlocksMap(editorState) {
  const selectionState = editorState.getSelection()
  const contentState = editorState.getCurrentContent()
  const startKey = selectionState.getStartKey()
  const endKey = selectionState.getEndKey()
  const blockMap = contentState.getBlockMap()
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]])
}

/**
 * Function returns collection of currently selected blocks.
 */
function getSelectedBlocksList(editorState) {
  return getSelectedBlocksMap(editorState).toList()
}

/**
 * Function returns the first selected block.
 */
function getSelectedBlock(editorState) {
  if (editorState) {
    return getSelectedBlocksList(editorState).get(0)
  }
  return undefined
}

/**
 * Function will return currently selected text in the editor.
 */
function getSelectionText(editorState) {
  let selectedText = ''
  const currentSelection = editorState.getSelection()
  let start = currentSelection.getAnchorOffset()
  let end = currentSelection.getFocusOffset()
  const selectedBlocks = getSelectedBlocksList(editorState)

  if (!selectedBlocks.size) return selectedText

  if (currentSelection.getIsBackward()) {
    const temp = start
    start = end
    end = temp
  }
  for (let i = 0; i < selectedBlocks.size; i += 1) {
    const blockStart = i === 0 ? start : 0
    const blockEnd =
      i === selectedBlocks.size - 1
        ? end
        : selectedBlocks.get(i).getText().length
    selectedText += selectedBlocks
      .get(i)
      .getText()
      .slice(blockStart, blockEnd)
  }
  return selectedText
}

function getEntityRange(editorState, entityKey) {
  const block = getSelectedBlock(editorState)
  let entityRange

  block.findEntityRanges(
    value => value.get('entity') === entityKey,
    (start, end) => {
      entityRange = {
        start,
        end,
        text: block.get('text').slice(start, end)
      }
    }
  )
  return entityRange
}

function getSelectionEntity(editorState) {
  let entity
  const selection = editorState.getSelection()
  let start = selection.getStartOffset()
  let end = selection.getEndOffset()
  if (start === end && start === 0) {
    end = 1
  } else if (start === end) {
    start -= 1
  }
  const block = getSelectedBlock(editorState)

  for (let i = start; i < end; i += 1) {
    const currentEntity = block.getEntityAt(i)
    if (!currentEntity) {
      return
    }
    if (i === start) {
      entity = currentEntity
    } else if (entity !== currentEntity) {
      return
    }
  }
  return entity
}

function addNewLineWithoutStyle(editorState) {
  // Does the current block type match a type we care about?
  const selection = editorState.getSelection()

  if (!selection.isCollapsed()) return editorState
  // Check if the selection is collapsed
  const contentState = editorState.getCurrentContent()
  const currentBlock = contentState.getBlockForKey(selection.getEndKey())
  const endOffset = selection.getEndOffset()
  const atEndOfBlock = (endOffset === currentBlock.getLength())

  // Check we’re at the start/end of the current block
  const emptyBlockKey = genKey()
  const emptyBlock = new ContentBlock({
    key: emptyBlockKey,
    text: '',
    type: 'unstyled',
    characterList: List(),
    depth: 0
  })
  const blockMap = contentState.getBlockMap()
  // Split the blocks
  const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === currentBlock
  })

  const blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === currentBlock
  }).rest()

  let augmentedBlocks
  let focusKey
  // Choose which order to apply the augmented blocks in depending
  // on whether we’re at the start or the end
  if (atEndOfBlock) {
    augmentedBlocks = [
      [currentBlock.getKey(), currentBlock],
      [emptyBlockKey, emptyBlock]
    ]
    focusKey = emptyBlockKey
  } else {
    // Empty first, current block afterwards
    augmentedBlocks = [
      [emptyBlockKey, emptyBlock],
      [currentBlock.getKey(), currentBlock]
    ]
    focusKey = currentBlock.getKey()
  }
  // Join back together with the current + new block
  const newBlocks = blocksBefore.concat(augmentedBlocks, blocksAfter).toOrderedMap()
  const newContentState = contentState.merge({
    blockMap: newBlocks,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: focusKey,
      anchorOffset: 0,
      focusKey: focusKey,
      focusOffset: 0,
      isBackward: false
    })
  })
  return EditorState.push(editorState, newContentState, DraftjsEditorChangeTypeConstants.SPLIT_BLOCK)
}

function isFocusOnEndOfBlock(selection, block) {
  return selection.getEndKey() === block.getKey()
    && selection.getEndOffset() === block.getLength()
}

function getCurrentBlock(editorState) {
  const selection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()
  const startKey = selection.getStartKey()

  return contentState.getBlockForKey(startKey)
}

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    },
    callback
  )
}


export {
  getSelectionEntity,
  getSelectedBlocksMap,
  getSelectedBlocksList,
  getSelectionText,
  getEntityRange,
  addNewLineWithoutStyle,
  isFocusOnEndOfBlock,
  getCurrentBlock,
  findLinkEntities
}
