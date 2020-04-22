import { map, isEmpty, trim, reduce } from 'lodash'
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from 'uuid'
import showdown from 'showdown'

const converter = new showdown.Converter()

export function htmlToMarkdown(htmlText) {
  // 1.we should tranfered Latex into [math]xxx[/math]
  const { template, latexContent } = convertMathjaxFromHtmlIntoMarkdown(htmlText)
  // 2.we should tranfered html into markdown for save
  const nextMarkdownText = converter.makeMarkdown(template)
  return reduce(latexContent, (rs, value, key) => {
    return rs.replace(key, `[math]${value}[/math]`)
  }, nextMarkdownText)
}
export function markdownToHtml(markdownText) {
  // 1.we should convert Latex into <span class="">xxx</span>
  const { template, latexContent } = convertMathjaxFromMarkdownIntoHtml(markdownText)
  // 2.we should tranfered  markdown into html for re-edit
  const nextHtmlText = converter.makeHtml(template)
  return reduce(latexContent, (rs, value, key) => {
    return rs.replace(key, `<span class="math-tex">${value}</span>`)
  }, nextHtmlText)
}

const LATEX_MATCHER = /(<span[^>]*>[\s\S]*<\/span>)/
const LATEX_CONTENT_MATCHER = /<span[^>]*>([\s\S]*)<\/span>/

/**
 *
 * @param {string} text html text
 */
function convertMathjaxFromHtmlIntoMarkdown(text) {
  const latexContent = {}
  if (isEmpty(trim(text))) {
    return { template: '', latexContent }
  }
  const strArray = text.split(LATEX_MATCHER)
  const template = map(strArray, strItem => {
    if (LATEX_CONTENT_MATCHER.test(strItem)) {
      const uuid = `placeholds[${v4()}]`
      latexContent[uuid] = RegExp.$1
      return uuid
    }
    return strItem
  }).join('')

  return {
    template,
    latexContent
  }
}

const MARKDOWN_LATEX_MATCHER = /(\[math\][\s\S]*\[\/math\])/
const MARKDOWN_LATEX_CONTENT_MATCHER = /\[math\]([\s\S]*)\[\/math\]/

/**
 *
 * @param {string} text markdown text
 */
function convertMathjaxFromMarkdownIntoHtml(text) {
  const latexContent = {}
  if (isEmpty(trim(text))) {
    return { template: '', latexContent }
  }
  const strArray = text.split(MARKDOWN_LATEX_MATCHER)
  const template = map(strArray, strItem => {
    if (MARKDOWN_LATEX_CONTENT_MATCHER.test(strItem)) {
      const uuid = `placeholds[${v4()}]`
      latexContent[uuid] = RegExp.$1
      return uuid
    }
    return strItem
  }).join('')

  return {
    template,
    latexContent
  }
}