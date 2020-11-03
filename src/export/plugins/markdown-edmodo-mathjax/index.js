/**
 * Plugin for Remarkable Markdown processor which transforms [math]xxxx[/math] sequences into draftjs data
 */
import trim from 'lodash/trim'

const markdownEdmodoMathjax = (md, options) => {
  const starter = '$'
  const ender = '$'

  const parseInlineKatex = (state, silent) => {
    const { src, pos, posMax } = state
    const firstChar = starter.slice(0, 1)
    if (src.charAt(pos) !== firstChar) return false
    try {
      let pointer = pos
      // 解析出语法中的[math]开头，并记录位置到matchStart字段
      while (pointer < posMax - starter.length) {
        if (src.slice(pointer, pointer + starter.length) === starter) {
          const matchStart = pointer
          pointer += starter.length
          // 指针继续向右偏移，查找语法结束标识符[/math]，并记录位置到matchEnd字段
          while (pointer <= posMax - ender.length) {
            if (src.slice(pointer, pointer + ender.length) === ender) {
              const matchEnd = pointer + ender.length
              const content = trim(src.slice(starter.length + matchStart, -ender.length + matchEnd))
              if (!silent) {
                // 截取起始位置和结束位置中的mathjax内容，推入state对象的token中，用于语法解析
                state.push({ type: 'katex_open', content: content, level: state.level })
                state.push({ type: 'text', content: '\t\t', level: state.level + 1 })
                state.push({ type: 'katex_close', level: state.level })
              }
              state.pos = matchEnd
              pointer = matchEnd
              break
            }
            ++pointer
          }
          // 如果解析到头部，则内部会进行指针偏移设置，如果未解析到头部，则继续向下偏移一个字符
        }
        ++pointer
      }
      return true
    } catch (error) {
      console.error('Syntax parsing fails')
      return false
    }
  }
  md.inline.ruler.push('katex', parseInlineKatex, options)
}
export default markdownEdmodoMathjax