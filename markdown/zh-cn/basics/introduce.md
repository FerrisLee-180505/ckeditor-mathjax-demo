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
      outputTemplate: '<a href="mailto:{username}@example.com">@{username}</a><span>&nbsp;</span>',
      minChars: 0
    },
    {
      feed: topics,
      marker: '#',
      itemTemplate: '<li data-id="{id}"><strong>{name}</strong></li>',
      outputTemplate: `<a href="https://example.com/social?tag={name}">{name}</a a><span>&nbsp;</span>`,
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
        <h4>The result of display:</h4>
        <MathjaxViewer text={text} />
      </React.Fragment>
    )
  }
}
</script>
```
### Props

| Field            | Type           | Default | Remarks                                                                       |
| ---------------- | -------------- | ------- | ----------------------------------------------------------------------------- |
| text             | String         | ''      | value of CKEditor                                                             |
| handleTextChange | Function       | noop    | callback on value changed                                                     |
| width            | Number\|String | 'auto'  | width of Component                                                            |
| height           | Number\|String | 300     | height of Component                                                           |
| mentions         | Any[]          | []      | [Doc Link](https://ckeditor.com/docs/ckeditor4/latest/examples/mentions.html) |
| useKityformula   | Boolean        | true    | enable kityformula mathjax editor                                             |

