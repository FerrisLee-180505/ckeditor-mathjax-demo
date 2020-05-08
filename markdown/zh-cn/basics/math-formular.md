```jsx
/* react live */
  
<script>
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
          handleTextChange={this.handleTextChange}
          config={{
            mentions: nextMentions,
            height:200
          }}
        />
        <h4>The value in CKEditor:</h4>
        <p>{`${text}`}</p>
      </React.Fragment>
    )
  }
}
</script>
```