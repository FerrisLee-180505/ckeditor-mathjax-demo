import React from 'react'

const BoldIcon = ({
  size = 24,
  color = '#8B8E9F',
  viewBox = '0 0 24 24',
  ...props
}) => (
    <React.Fragment>
      <svg width={size} height={size} viewBox={viewBox} {...props}>
        <path d="M11.5 5C10.6716 5 10 5.67157 10 6.5C10 7.32843 10.6716 8 11.5 8H14V17.5C14 18.3284 14.6716 19 15.5 19C16.3284 19 17 18.3284 17 17.5V8H19.5C20.3284 8 21 7.32843 21 6.5C21 5.67157 20.3284 5 19.5 5H11.5ZM3 11.5C3 12.3284 3.67157 13 4.5 13H6V17.5C6 18.3284 6.67157 19 7.5 19C8.32843 19 9 18.3284 9 17.5V13H10.5C11.3284 13 12 12.3284 12 11.5C12 10.6716 11.3284 10 10.5 10H4.5C3.67157 10 3 10.6716 3 11.5Z" fill={color} />
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.1047 0.5C6.77604 0.5 7.10922 1.31438 6.63039 1.78493L4.45306 3.92463C4.16126 4.21139 3.69349 4.21139 3.40169 3.92463L1.22435 1.78493C0.745528 1.31438 1.07871 0.5 1.75004 0.5L6.1047 0.5Z" fill={color} />
      </svg>
    </React.Fragment>
  )


export default BoldIcon
