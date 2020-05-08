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
  render() {
    const { text } = this.state
    return (
      <React.Fragment>
        <RichInput
          style={{ border: '1px solid gray' }}
          text={text}
          handleTextChange={this.handleTextChange}
          config={{
            type: 'inline'
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
