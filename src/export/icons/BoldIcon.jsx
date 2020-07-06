import React from 'react'

const BoldIcon = ({
  size = 24,
  color = '#8B8E9F',
  viewBox = '0 0 24 24',
  ...props
}) => (
    <svg width={size} height={size} viewBox={viewBox} {...props}>
      <path d="M15.6 11.79C16.57 11.12 17.25 10.02 17.25 9C17.25 6.74 15.5 5 13.25 5H8.5C7.67157 5 7 5.67157 7 6.5V17.5C7 18.3284 7.67157 19 8.5 19H14.04C16.13 19 17.75 17.3 17.75 15.21C17.75 13.69 16.89 12.39 15.6 11.79ZM10 7.5H13C13.83 7.5 14.5 8.17 14.5 9C14.5 9.83 13.83 10.5 13 10.5H10V7.5ZM13.5 16.5H10V13.5H13.5C14.33 13.5 15 14.17 15 15C15 15.83 14.33 16.5 13.5 16.5Z" fill={color} />
    </svg>
  )

export default BoldIcon
