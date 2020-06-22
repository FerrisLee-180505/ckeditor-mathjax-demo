/**
 * Plugin for Remarkable Markdown processor which transforms [math]xxxx[/math] sequences into draftjs data
 */
const markdownEdmodoMathjax = (md, options) => {
  const starter = '[math]'
  const ender = '[/math]'

  const parseInlineKatex = (state, silent) => {
    const start = state.pos, max = state.posMax
    let pos = start
    if (state.src.charAt(pos) !== '[') return false
    while (pos < max - starter.length) {
      if (state.src.slice(pos, pos + starter.length) === starter) {
        const matchStart = pos
        let matchEnd = pos + starter.length
        while (matchEnd < max - ender.length) {
          if (state.src.slice(matchEnd, matchEnd + ender.length) === ender) {
            if (!silent) {
              const content = state.src.slice(matchStart, matchEnd + ender.length)
              state.push({ type: 'katex_open', content: content.slice(6, content.length - 7), level: state.level })
              state.push({ type: 'text', content: '\t\t', level: state.level + 1 })
              state.push({ type: 'katex_close', level: state.level })
            }
            state.pos = matchEnd + ender.length
            pos = matchEnd + ender.length
            break
          }
          ++matchEnd
        }
        pos = matchEnd + starter.length
        break
      }
      ++pos
    }
  }

  md.inline.ruler.push('katex', parseInlineKatex, options)
}
export default markdownEdmodoMathjax