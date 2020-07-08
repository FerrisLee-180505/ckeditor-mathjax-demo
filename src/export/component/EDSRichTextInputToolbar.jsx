//    ____ _____ ___  ____
//   / ___|_   _/ _ \|  _ \
//   \___ \ | || | | | |_) |
//    ___) || || |_| |  __/
//   |____/ |_| \___/|_|
//
//  This component is part of the Syllabus (EDS) project
//  Before making any updates to it, make sure you read the "Contributing to Syllabus" section in http://guide.clubmodo.com/syllabus/
//

import React from 'react'
import classnames from 'classnames'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

import './EDSRichTextInputToolbar.css'

const StyleButton = ({ onToggle, active, label, style, disabled }) => {
  const className = classnames('RichEditor-styleButton', { 'RichEditor-activeButton': active, 'RichEditor-disabledButton': disabled })
  return (
    <span
      className={className}
      onMouseDown={e => {
        e.preventDefault()
        !disabled && onToggle && onToggle(style)
      }}
    >
      {label}
    </span>
  )
}

const EDSRichTextInputToolbar = ({ className, editorState, handleClick, toolbarItems, onMouseEnter }) => {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  const currentStyle = editorState.getCurrentInlineStyle()

  return (
    <div className={classnames('RichEditor-toolbar', className)} onMouseEnter={onMouseEnter}>
      {
        toolbarItems.map((type, index) => {
          if (isEmpty(type.children)) {
            return (
              <StyleButton
                key={`${type.style}-${index}`}
                disabled={type.disabled}
                active={type.style === blockType || currentStyle.has(type.style)}
                label={type.label}
                onToggle={handleClick}
                style={type.style}
              />
            )
          }

          const isActive = blockType !== 'unstyled' && type.children.map(child => child.style).includes(blockType)
          const classNameString = classnames('RichEditor-headerButton', { 'RichEditor-activeButton': isActive })

          return (
            <UncontrolledDropdown key={`${type.style}-${index}`} style={{ display: 'inline-block' }}>
              <DropdownToggle tag="button" className={classNameString}>
                {type.label}
              </DropdownToggle>
              <DropdownMenu>
                {
                  type.children.map(item => {
                    return <DropdownItem key={item.style} onClick={() => handleClick(item.style)}>{item.label}</DropdownItem>
                  })
                }
              </DropdownMenu>
            </UncontrolledDropdown>
          )
        })
      }
    </div>
  )
}

export default EDSRichTextInputToolbar
