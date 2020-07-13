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
    const toolbarItems = [
      { label: <HeaderIcon />, 
        children: [{
          label: <h1>Large Title</h1>,
          style: 'header-one'
        },
        {
          label: <h2>Medium Title</h2>,
          style: 'header-two'
        },
        {
          label: <p>Regular Text</p>,
          style: 'unstyled'
        },
      ]},
      { label: <SplitIcon />, style: '' },
      { label: <UnorderedListIcon />, style: 'unordered-list-item' },
      { label: <OrderedListIcon />, style: 'ordered-list-item' },
      { label: <SplitIcon />, style: '' },
      { label: <CodeBlockIcon />, style: 'code-block' },
      { label: <SplitIcon />, style: '' },
      { label: <BoldIcon />, style: 'BOLD' },
      { label: <ItalicIcon />, style: 'ITALIC' },
      { label: <UnderLineIcon />, style: 'UNDERLINE' },
      { label: <StrikeThroughIcon />, style: 'STRIKETHROUGH' }
    ]
    return <div>
      <p>please notice the theme-simple.css will affect the styles of the component</p>
      <EDSRichTextInput
        toolbarItems={toolbarItems}
        value={value}
        showBorder
        onChange={this.onChange}
      />
    </div>
  }
}
</script>
```