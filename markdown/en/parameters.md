| Params          | Description            | Type                    | DefaultValue | IsRequire | Remark            |
| --------------- | ---------------------- | ----------------------- | ------------ | --------- | ----------------- |
| className       | 组件样式               | string                  | ''           |           |                   |
| placeholder     | placeholder 展示文字   | string                  |              |           |                   |
| value           | 输入框内容             | string                  | ''           | Yes       |                   |
| onChange        | 输入框内容变化时的回调 | Function(value: string) |              | Yes       |                   |
| showBorder      | 是否展示边框           | boolean                 | true         |           |                   |
| customStyleMap  | 自定义模块样式         | object                  |              |           |                   |
| toolbar         | 自定义工具栏           | array                   |              |           |                   |
| enableMentions  | 是否开启 mentions 标识 | boolean                 | false        |           |                   |
| enableHashTag   | 是否开启 hashtag 标识  | boolean                 | false        |           |                   |
| enableMathjax   | 是否开启 mathjax 标识  | boolean                 | false        |           |                   |
| toolbarPosition | 工具栏展示位置         | string                  | 'top'        |           | 'top' or 'bottom' |