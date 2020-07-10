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
      <p>由于文档结构自带样式（theme-simple.css）会影响组件内样式，所以此处样式会出现变形。install使用时，并无影响</p>
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