# ReactLive

## 常规渲染

常规的 JS/JSX 代码块照常渲染
```jsx
import { Button } from 'my-react'

class App extends React.Component {
  render () {
    return <Button type="primary">确认</Button>
  }
}

ReactDOM.render(<App />, document.body)
```

## 组件渲染

注释为代码开头增加 ``/* react */`` 注释，即可开启组件渲染

    ```jsx
    /* react */
    <script>
    const Button = AppDemo

    export default class App extends React.Component {
      render () {
        return <Button
          type="primary"
          onClick={() => alert('好的')}
        >
          确认
        </Button>
      }
    }
    </script>
    ```

将渲染出如下内容

```jsx
/* react */
<script>
const Button = AppDemo

export default class App extends React.Component {
  render () {
    return <Button
      type="primary"
      onClick={() => alert('好的')}
    >
      确认
    </Button>
  }
}
</script>
```

## 实时编辑

注释为代码开头增加 ``/* react live */`` 注释，即可开启组件渲染和代码实时编辑

    ```jsx
    /* react live */
    <script>
    const Button = AppDemo

    export default class App extends React.Component {
      render () {
        return <Button
          type="primary"
          onClick={() => alert('好的')}
        >
          确认
        </Button>
      }
    }
    </script>
    ```

可以渲染出

```jsx
/* react live */
<script>
const Button = AppDemo

export default class App extends React.Component {
  render () {
    return <Button
      type="primary"
      onClick={() => alert('好的')}
    >
      确认
    </Button>
  }
}
</script>
```

## 魔法Block

可以通过代码块的方式注入更多内容

    ```jsx
    /* react live */
    <className>demo-class</className>
    <title>测试组件标题</title>
    <desc>这个按钮组件
    - 覆盖了按钮颜色<desc>
    <style>
      .demo-class button {
        background: red !important;
      }
    </style>
    <script>
    const Button = AppDemo

    export default class App extends React.Component {
      render () {
        return <Button
          type="primary"
          onClick={() => alert('好的')}
        >
          确认
        </Button>
      }
    }
    </script>
    ```

可以渲染出

```jsx
/* react live */
<className>demo-class</className>
<title>测试组件标题</title>
<desc>这个按钮组件
- 覆盖了按钮颜色<desc>
<style>
  .demo-class button {
    background: red !important;
  }
</style>
<script>
const Button = AppDemo

export default class App extends React.Component {
  render () {
    return <Button
      type="primary"
      onClick={() => alert('好的')}
    >
      确认
    </Button>
  }
}
</script>
```

### 类型说明

| 属性      | 类型   | 默认值 | 说明                                    |
|-----------|--------|--------|-----------------------------------------|
| className | string | null   | 添加外层className，如有多个请用空格隔开 |
| title     | string | null   | 组件标题                                |
| desc      | string | null   | 组件说明，支持MD语法                    |
| style     | string | null   | 额外注入样式                            |

### API

```js
window.$docsify = {
  plugins: [
    (function () {
      return ReactLiveBox.create(scope, theme)
    })()
  ],
}
```

| 属性  | 类型   | 默认值 | 说明                                                                            |
|-------|--------|--------|---------------------------------------------------------------------------------|
| scope | object | null   | 注入实时渲染的局部变量                                                          |
| theme | object | null   | PrismJS主题, 请参考 [文档](https://github.com/FormidableLabs/prism-react-renderer#theming) |

> 实时渲染的代码默认可以使用挂载在`window`下的变量, 建议将组件库打包成UMD包引入全局

!> `index.html`中默认加载了`react`/`react-dom`，所以引用的组件库打包时候请排除`react`/`react-dom`, 否则请删除`index.html`引入的`react`/`react-dom

> 如果是`@gem-mine/cli@^2.0.0`的组件库，请使用指令
```
gms build --target=lib --excludeReact
```