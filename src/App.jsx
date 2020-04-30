import React from 'react'
import RichInput from './export'
import mentions from './../mock/data/mentions'
import topics from './../mock/data/topics'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
    this.handleTextChange = this.handleTextChange.bind(this)
  }
  componentDidMount() {
    // getting mock datas from the API after 500ms
    setTimeout(() => {
      this.setState({
        text: ''
      })
    }, 500)
  }
  /**
   * function callback on value changeed
   * @param {string} nextText new value of CKEditor
   */
  handleTextChange(nextText) {
    this.setState({
      text: nextText
    })
  }

  dataFeed(opts, callback) {
    const matchProperty = 'username'
    let data = mentions.filter(function (item) {
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
    const { text } = this.state
    const nextMentions = [{
      feed: this.dataFeed,
      itemTemplate: `<li data-id="{id}">
        <img style="display: inline-block; vertical-align: middle; height: 30px; border-radius: 50%;" src="https://ckeditor.com/docs/ckeditor4/latest/examples/assets/mentions/img/{avatar}.jpg" /> 
        <strong class="username">{username}</strong>
        <span class="fullname">{fullname}</span>
      </li>`,
      outputTemplate: '<a href="https://www.edmodo.com/{username}">@{username}</a>',
      minChars: 0
    },
    {
      feed: topics,
      marker: '#',
      itemTemplate: '<li data-id="{id}"><strong>{name}</strong></li>',
      outputTemplate: '<a href="https://www.edmodo.com/{name}">{name}</a>',
      minChars: 1
    }]
    return (
      <React.Fragment>
        <RichInput
          text={text}
          height={300}
          useKityformula
          mentions={nextMentions}
          handleTextChange={this.handleTextChange}
        />
        <h4>The value in CKEditor:</h4>
        <p>{`${text}`}</p>
      </React.Fragment>
    )
  }
}
