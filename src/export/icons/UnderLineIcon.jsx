import React from 'react'

const UnderLineIcon = ({
  size = 28,
  color = '#8B8E9F',
  viewBox = '0 0 24 24',
  ...props
}) => (
    <svg width={size} height={size} viewBox={viewBox} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M17.5 20C18.0523 20 18.5 20.4477 18.5 21C18.5 21.5523 18.0523 22 17.5 22H6.5C5.94772 22 5.5 21.5523 5.5 21C5.5 20.4477 5.94772 20 6.5 20H17.5Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.5 5C8.32843 5 9 5.67157 9 6.5V12.404C9 14.1439 10.3728 15.5 12 15.5C13.6272 15.5 15 14.1439 15 12.404V6.5C15 5.67157 15.6716 5 16.5 5C17.3284 5 18 5.67157 18 6.5V12.404C18 15.7407 15.3434 18.5 12 18.5C8.65655 18.5 6 15.7407 6 12.404V6.5C6 5.67157 6.67157 5 7.5 5Z" fill={color} />
    </svg>
  )

export default UnderLineIcon
