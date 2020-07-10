# Draftjs Mathjax Component Doc

## 概述

这是一个基于 [Draftjs](https://draftjs.org/) 的富文本编辑组件。

特性
- 插入链接
- 插入数学公式

## 安装

```
npm i draftjs-mathjax-component --save
```

## 语法规则
> Edmodo 关于富文本的表述规则由标准的 markdown 语法+自定义语法组成。自定义语法用于进行数学公式的存储和表述，形如

```
[math]a^2=1[/math]
```

## 基础应用

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
    return <EDSRichTextInput value={value} onChange={this.onChange} />
  }
}
</script>
```

## 源码开源

> 源码获取请参考[ckeditor-mathjax-demo](https://github.com/FerrisLee-180505/ckeditor-mathjax-demo)
