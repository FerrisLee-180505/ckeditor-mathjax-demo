import React from 'react'

const ItalicIcon = ({
  size = 24,
  color = '#8B8E9F',
  viewBox = '0 0 24 24',
  ...props
}) => (
    <svg width={size} height={size} viewBox={viewBox} {...props}>
      <path d="M11.5 5C10.6716 5 10 5.67157 10 6.5C10 7.32843 10.6716 8 11.5 8H12.21L8.79 16H7.5C6.67157 16 6 16.6716 6 17.5C6 18.3284 6.67157 19 7.5 19H12.5C13.3284 19 14 18.3284 14 17.5C14 16.6716 13.3284 16 12.5 16H11.79L15.21 8H16.5C17.3284 8 18 7.32843 18 6.5C18 5.67157 17.3284 5 16.5 5H11.5Z" fill={color} />
    </svg>
  )

export default ItalicIcon
