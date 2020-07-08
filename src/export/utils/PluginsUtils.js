// === Utils === //
import get from 'lodash/get'
import trim from 'lodash/trim'
import { convertToRaw } from 'draft-js'
import { draftToMarkdown as dtm, markdownToDraft as mtd } from 'markdown-draft-js'

// === Plugins === //
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createMathjaxPlugin from './../plugins/draft-js-mathjax-plugin/index'
import createEdmodoPlugin from './../plugins/draft-js-edmodo-plugin/index'
import MarkdownEdmodoMathjax from './../plugins/markdown-edmodo-mathjax/index'

const mathjaxPlugin = createMathjaxPlugin()
const edmodoPlugin = createEdmodoPlugin()
const hashtagPlugin = createHashtagPlugin({
  theme: {
    hashtag: 'HashTag-item'
  }
})
const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@'
})
const options = {
  preserveNewlines: true,
  entityItems: {
    INLINETEX: {
      open: function (entity) {
        if (!get(entity, 'data.teX', '')) return ''
        return '[math]' + trim(entity.data.teX)
      },

      close: function (entity) {
        if (!get(entity, 'data.teX', '')) return ''
        return '[/math]'
      }
    }
  },
  remarkablePlugins: [MarkdownEdmodoMathjax],
  blockEntities: {
    katex_open: function (item) {
      return {
        type: 'INLINETEX',
        mutability: 'IMMUTABLE',
        data: {
          teX: item.content,
          displaystyle: false
        }
      }
    }
  }
}

/**
 * append current plugins list for draftjs component
 */
function appendPluginsArray(config) {

  const { enableMentions, enableHashTag, enableMathjax } = config

  const plugins = []

  if (enableMentions) {
    plugins.push(mentionPlugin)
  }

  if (enableHashTag) {
    plugins.push(hashtagPlugin)
  }

  if (enableMathjax) {
    plugins.push(mathjaxPlugin)
  }
  plugins.push(edmodoPlugin)

  return plugins
}

/**
 * Draftjs数据模型转化成markdown文档
 * @param {*} editorState draftjs data
 */
function draftToMarkdown(editorState) {
  return dtm(convertToRaw(editorState.getCurrentContent()), options)
}

/**
 * markdown文档转化成Draftjs数据模型
 * @param {*} markdownText markdown text
 */
function markdownToDraft(markdownText) {
  return mtd(markdownText, options)
}

export {
  appendPluginsArray,
  draftToMarkdown,
  markdownToDraft
}
