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
          text={text}
          handleTextChange={this.handleTextChange}
          config={{
            contentsLangDirection: 'rtl',
            dialog_buttonsOrder :'rtl',
            contentsLanguage:'ar',
            language:'ar',
            toolbar:[['Source','-','Bold','Italic','-','Mathjax']]
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