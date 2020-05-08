```jsx
/* react live */
  
<script>
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      skinType: localStorage.skin || 'kama'
    }
    this.handleTextChange = this.handleTextChange.bind(this)
    this.onSkinTypeChange = this.onSkinTypeChange.bind(this)
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

  onSkinTypeChange(event) {
    const { target: { value } } = event
    this.setState({
      skinType: value
    })
    localStorage.skin = value
    // reload page and ckeditor init new skin resource
    window.location.reload()
  }

  render() {
    const { text, skinType } = this.state
    const nextConfig = {
      skin: skinType
    }
    return (
      <React.Fragment>
        <p>
          <select value={skinType} onChange={this.onSkinTypeChange}>
            <option value="kama">kama</option>
            <option value="moono-lisa">Moono-Lisa</option>
            <option value="moono">Moono</option>
          </select>
        </p>
        <RichInput
          key={skinType}
          text={text}
          config={nextConfig}
          handleTextChange={this.handleTextChange}
        />
        <h4>The value in CKEditor:</h4>
        <p>{`${text}`}</p>
      </React.Fragment>
    )
  }
}
</script>
```
