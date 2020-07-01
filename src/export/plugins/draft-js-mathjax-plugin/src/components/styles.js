const commonEdit = {
  border: '0.5px solid red',
  outline: 'none',
  fontFamily: '\'Inconsolata\', \'Menlo\', monospace',
  fontSize: '1em',
  boxShadow: '5px 5px 5px rgba(0,0,0,0.7)',
  background: 'yellow'
}

const commonRendered = {
  cursor: 'pointer'
}

export default {
  inline: {
    edit: {
      ...commonEdit,
      display: 'inline-block',
      textAlign: 'center',
      padding: '5px'

    },
    preview: {
      top: '200%' /* se réfère à la hauteur de ligne */
    },
    rendered: {
      ...commonRendered
    }
  },
  block: {
    edit: {
      ...commonEdit,
      display: 'block',
      margin: '10px auto 10px',
      padding: '14px'
    },
    preview: {
      top: 'calc(100%+1em)'
    },
    rendered: {
      ...commonRendered
    }
  }
}
