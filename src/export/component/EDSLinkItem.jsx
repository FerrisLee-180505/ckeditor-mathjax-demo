import React from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { UncontrolledTooltip } from 'reactstrap'

// === Utils === //
import noop from 'lodash/noop'

// === Styles === //
import './EDSLinkItem.css'

const LinkItem = (props) => {
  const { onEdit, onRemove, decoratedText, blockKey, entityKey } = props
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  const id = `Tooltip-${blockKey}-${entityKey}`
  return (
    <>
      <a href={url} id={id}>
        {props.children}
      </a>

      <UncontrolledTooltip key={id} className="RichEditor-link-tooltip" placement="top" target={id} trigger="click">
        <p className="RichEditor-link-tooltip-content">
          <span onClick={() => { window.open(url) }} title={url} className="RichEditor-url">{url}</span>
          <span className="RichEditor-split">|</span>
          <span className="RichEditor-btn" onClick={() => onEdit({ decoratedText, url })}>
            Edit
          </span>
          <span className="RichEditor-split">|</span>
          <span className="RichEditor-btn" onClick={() => onRemove()}>
            Remove
          </span>
        </p>
      </UncontrolledTooltip>
    </>
  )
}

LinkItem.propTypes = {
  onEdit: PropTypes.func,
  onRemove: PropTypes.func
}

LinkItem.defaultProps = {
  onEdit: noop,
  onRemove: noop
}

export default LinkItem
