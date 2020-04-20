import React from 'react'
import RichInput from './export'
import MathjaxViewer from './export/component/MathjaxViewer'
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

  /**
   * function callback on value changeed
   * @param {string} nextText new value of CKEditor
   */
  handleTextChange(nextText) {
    this.setState({
      text: nextText
    })
  }

  getFeedItems(queryText, datas) {
    // As an example of an asynchronous action, return a promise
    // that resolves after a 100ms timeout.
    // This can be a server request or any sort of delayed action.
    return new Promise(resolve => {
      setTimeout(() => {
        const itemsToDisplay = datas
          // Filter out the full list of all items to only those matching the query text.
          .filter(item => item.name.toLowerCase().includes(queryText.toLowerCase()))
          // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
          .slice(0, 10)

        resolve(itemsToDisplay)
      }, 100)
    })
  }
  customItemRenderer(item) {
    const itemElement = document.createElement('span')

    itemElement.classList.add('custom-item')
    itemElement.id = `mention-list-item-id-${item.id}`
    itemElement.textContent = `${item.fullname} `

    const usernameElement = document.createElement('span')

    usernameElement.classList.add('custom-item-username')
    usernameElement.textContent = item.id

    itemElement.appendChild(usernameElement)

    return itemElement
  }


  render() {
    const { text } = this.state
    const nextMentions = {
      feeds: [
        {
          marker: '@',
          feed: keyword => this.getFeedItems(keyword, mentions),
          itemRenderer: this.customItemRenderer
        },
        {
          marker: '#',
          feed: keyword => this.getFeedItems(keyword, topics)
        }

      ]
    }
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
        <h4>The result of display:</h4>
        <MathjaxViewer text={text} />
      </React.Fragment>
    )
  }
}
