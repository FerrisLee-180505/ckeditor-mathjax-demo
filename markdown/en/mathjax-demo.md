```jsx
/* react */
<script>

export default class App extends React.Component {
   constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(value) {
    this.setState({ value })
  }
  render () {
    const { value } = this.state
    return <div>
      <p>please notice the theme-simple.css will affect the styles of the component</p>
      <b>Press $ to input math formular</b>
      <EDSRichTextInput
        enableMathjax
        value={value}
        showBorder
        onChange={this.onChange}
      />
    </div>  
  }
}
</script>
```