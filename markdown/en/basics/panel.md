## Panel演示
<!-- panels:start -->

<!-- div:left-panel -->

**Advantages**

-   Create div panels really fast and anywhere in your .md file.
-   Choose the classnames for your divs and stylize them.
-   Use CSS custom properties to change it's structure.
-   Prefab CSS classes for "left-panel", "right-panel" and "title-panel".

**Compatibility**

-   Fully compatible with any markdown or html features:

<details>
  <summary>code snippets </summary>

```html
  <body>
    <img src="http://www.pudim.com.br/pudim.jpg">
  </body>
```

</details>

<details>
  <summary>quotes</summary>

> just a quote

?> a cooler quote...  <small> (at least i think it is)</small>

</details>

<details>
  <summary>images <small>(memorable)</small></summary>

  <br/>
  <img src="https://avatars0.githubusercontent.com/u/5666881?s=400&u=d94729bdf16611396a720b338c115ec0be656ba6&v=4" width="64" height="64">
</details>

-   Fully compatible with major docsify plugins such as:

> [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable/)
>
> [docsify-tabs](https://jhildenbiddle.github.io/docsify-tabs/)
>
> [docsify-copy-code](https://github.com/jperasmus/docsify-copy-code)
>
> [docsify-pagination](https://github.com/imyelo/docsify-pagination)

**Limitations**

-   _Nesting_ (i.e panels within panels) all pannels are rendered as siblings, Nesting only avaiable throught post-render javascript code.

<!-- div:right-panel -->

For multi-language documentation you can use it along with [docsify-tabs](https://jhildenbiddle.github.io/docsify-tabs/):

<!-- tabs:start -->

### **HTML**

```html
<!-- HTML -->
<h1>Heading</h1>
<p>This is a paragraph.</p>
```

### **JS**

```js
// JavaScript
function add(a, b) {
  return Number(a + b);
}
```

### **CSS**

```css
/* CSS */
body {
  background: white;
}
```

<!-- tabs:end -->

<!-- div:title-panel -->

<!-- panels:end -->