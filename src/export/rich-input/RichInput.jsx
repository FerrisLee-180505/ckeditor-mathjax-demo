import React, { Component } from 'react'
import { noop } from 'lodash'
import CKEditor from 'ckeditor4-react'
import WithMathjaxDisplayed from './WithMathjaxDisplayed'
import metions from './../constants/Metions'
import topics from './../constants/Topics'

class RichInput extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  dataFeed(opts, callback) {
    const matchProperty = 'username'
    let data = metions.filter(function (item) {
      return item[matchProperty].indexOf(opts.query.toLowerCase()) == 0
    })
    data = data.sort(function (a, b) {
      return a[matchProperty].localeCompare(b[matchProperty], undefined, {
        sensitivity: 'accent'
      })
    })

    callback(data)
  }

  render() {
    const { text, handleTextChange } = this.props
    return (
      <CKEditor
        data={text}
        onChange={evt => {
          const nextText = evt.editor.getData()
          handleTextChange(nextText)
        }}
        config={{
          contentsCss: [
            'http://cdn.ckeditor.com/4.14.0/full-all/contents.css'
          ],
          mathJaxLib: '//cdncs.101.com/v0.1/static/dist_learningobjectives_editor/mubiao-static/lib/MathJax/MathJax.js?config=TeX-AMS-MML_SVG-full,local/local',
          height: 300,
          width: 'auto',
          allowedContent: true,
          extraAllowedContent: '*(*);*{*}',
          extraPlugins: 'mathjax,mentions,emoji,basicstyles,undo,link,wysiwygarea,toolbar',
          enterMode: CKEDITOR.ENTER_BR,
          shiftEnterMode: CKEDITOR.ENTER_BR,
          enableContextMenu: false,
          fillEmptyBlocks: false,
          language: 'en',
          toolbarLocation: 'top',
          title: false,
          mentions: [{
            feed: this.dataFeed,
            itemTemplate: '<li data-id="{id}">' +
              '<img class="photo" src="assets/mentions/img/{avatar}.jpg" />' +
              '<strong class="username">{username}</strong>' +
              '<span class="fullname">{fullname}</span>' +
              '</li>',
            outputTemplate: '<a href="mailto:{username}@example.com">@{username}</a><span>&nbsp;</span>',
            minChars: 0
          },
          {
            feed: topics,
            marker: '#',
            itemTemplate: '<li data-id="{id}"><strong>{name}</strong></li>',
            outputTemplate: '<a href="https://example.com/social?tag={name}">{name}</a><span>&nbsp;</span>',
            minChars: 1
          }]
        }}
      >
      </CKEditor>
    )
  }
}
RichInput.defaultProps = {
  text: '',
  handleTextChange: noop
}

export default WithMathjaxDisplayed(RichInput)