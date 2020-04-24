import showdown from 'showdown'
import { isEmpty, repeat, trimStart, trimEnd } from 'lodash'

const prepareText = function (text, before, after) {
  if (isEmpty(text)) {
    return `${before}${text}${after}`
  }
  const spaceBeforeCount = text.length - trimStart(text).length
  const spaceAfterCount = text.length - trimEnd(text).length
  return `${repeat(' ', spaceBeforeCount)}${before}${text.trim()}${after}${repeat(' ', spaceAfterCount)}`
}

showdown.subParser('makeMarkdown.em&strong*del', function (node, globals, before, after) {
  'use strict'
  let txt = ''
  if (node.hasChildNodes()) {
    const children = node.childNodes,
      childrenLength = children.length
    let tempText = ''
    for (let i = 0; i < childrenLength; ++i) {
      tempText += showdown.subParser('makeMarkdown.node')(children[i], globals)
    }
    txt = prepareText(tempText, before, after)
  }
  return txt
})
showdown.subParser('makeMarkdown.txt', function (node) {
  'use strict'
  let txt = node.nodeValue
  // multiple spaces are collapsed
  txt = txt.replace(/ +/g, ' ')

  // replace the custom ¨NBSP; with a space
  txt = txt.replace(/¨NBSP;/g, ' ')

  // ", <, > and & should replace escaped html entities
  txt = showdown.helper.unescapeHTMLEntities(txt)

  // escape markdown magic characters
  // emphasis, strong and strikethrough - can appear everywhere
  // we also escape pipe (|) because of tables
  // and escape ` because of code blocks and spans
  txt = txt.replace(/([*_~|`])/g, '\\$1')

  // escape > because of blockquotes
  txt = txt.replace(/^(\s*)>/g, '\\$1>')

  // hash character, only troublesome at the beginning of a line because of headers
  // txt = txt.replace(/^#/gm, '\\#');

  // horizontal rules
  txt = txt.replace(/^(\s*)([-=]{3,})(\s*)$/, '$1\\$2$3')

  // dot, because of ordered lists, only troublesome at the beginning of a line when preceded by an integer
  txt = txt.replace(/^( {0,3}\d+)\./gm, '$1\\.')

  // +, * and -, at the beginning of a line becomes a list, so we need to escape them also (asterisk was already escaped)
  txt = txt.replace(/^( {0,3})([+-])/gm, '$1\\$2')

  // images and links, ] followed by ( is problematic, so we escape it
  txt = txt.replace(/]([\s]*)\(/g, '\\]$1\\(')

  // reference URIs must also be escaped
  txt = txt.replace(/^ {0,3}\[([\S \t]*?)]:/gm, '\\[$1]:')

  return txt
})

showdown.subParser('makeMarkdown.node', function (node, globals, spansOnly) {
  'use strict'
  spansOnly = spansOnly || false

  let txt = ''

  // edge case of text without wrapper paragraph
  if (node.nodeType === 3) {
    return showdown.subParser('makeMarkdown.txt')(node, globals)
  }

  // HTML comment
  if (node.nodeType === 8) {
    return '<!--' + node.data + '-->\n\n'
  }

  // process only node elements
  if (node.nodeType !== 1) {
    return ''
  }

  const tagName = node.tagName.toLowerCase()
  switch (tagName) {

  case 'h1':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 1) + '\n\n' }
    break
  case 'h2':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 2) + '\n\n' }
    break
  case 'h3':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 3) + '\n\n' }
    break
  case 'h4':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 4) + '\n\n' }
    break
  case 'h5':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 5) + '\n\n' }
    break
  case 'h6':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 6) + '\n\n' }
    break

  case 'p':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.paragraph')(node, globals) + '\n\n' }
    break

  case 'blockquote':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.blockquote')(node, globals) + '\n\n' }
    break

  case 'hr':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.hr')(node, globals) + '\n\n' }
    break

  case 'ol':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.list')(node, globals, 'ol') + '\n\n' }
    break

  case 'ul':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.list')(node, globals, 'ul') + '\n\n' }
    break

  case 'precode':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.codeBlock')(node, globals) + '\n\n' }
    break

  case 'pre':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.pre')(node, globals) + '\n\n' }
    break

  case 'table':
    if (!spansOnly) { txt = showdown.subParser('makeMarkdown.table')(node, globals) + '\n\n' }
    break

    //
    // SPANS
    //
  case 'code':
    txt = showdown.subParser('makeMarkdown.codeSpan')(node, globals)
    break

  case 'em':
  case 'i':
    txt = showdown.subParser('makeMarkdown.em&strong*del')(node, globals, '*', '*')
    break

  case 'strong':
  case 'b':
    txt = showdown.subParser('makeMarkdown.em&strong*del')(node, globals, '**', '**')
    break
  case 's':
  case 'del':
    txt = showdown.subParser('makeMarkdown.em&strong*del')(node, globals, '~~', '~~')
    break

  case 'a':
    txt = showdown.subParser('makeMarkdown.links')(node, globals)
    break

  case 'img':
    txt = showdown.subParser('makeMarkdown.image')(node, globals)
    break

  default:
    txt = node.outerHTML + '\n\n'
  }

  // common normalization
  // TODO eventually

  return txt
})
export default showdown