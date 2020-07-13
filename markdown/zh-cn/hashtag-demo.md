```jsx
/* react */
<script>

export default class App extends React.Component {
   constructor(props) {
    super(props)
    this.state = {
      value: 'I love #edmodo'
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(value) {
    this.setState({ value })
  }
  render () {
    const { value } = this.state
    return <EDSRichTextInput
      enableHashTag
      value={value}
      showBorder
      onChange={this.onChange}
    />
  }
}
</script>
```