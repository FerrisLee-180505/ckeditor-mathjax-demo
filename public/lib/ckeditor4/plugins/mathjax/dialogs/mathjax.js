/**
 * Created by chenzuopeng on 15-5-27.
 */

var localeObj = {
  'zh-cn': {
    '公式不完整': '公式不完整',
    '公式编辑器': '公式编辑器',
    '图片选择': '图片选择'
  },
  'en': {
    '公式不完整': 'Incomplete Formula',
    '公式编辑器': 'Formula Editor',
    '图片选择': 'Picture Select'
  }
}

var locale = ''

CKEDITOR.dialog.add('mathjax', function (editor) {
  var width = 952;
    
  var height = 800;

  function getIFrame () {
    return this.getElement().getFirst().$;
  };

  // var localeArray = ['zh-cn', 'en']
  var localeArray = ['zh-cn']
  function localeMach (locale) {
    if (localeArray.indexOf(locale) !== -1) {
      return locale
    } else {
      return localeArray[0]
    }
  }

  function getIFrameSrc () {
    locale = localStorage.lang
    if (!locale || locale.toLowerCase() === 'zh-cn') {
      return CKEDITOR.basePath + 'plugins/kityformula/dialogs/kityformula-mathjax.html?f=' + (new Date()).valueOf();
    } else {
      var array = [
        'f=' + (new Date()).valueOf(),
        'locale=' + locale.toLowerCase()
      ]
      return CKEDITOR.basePath + 'plugins/kityformula/dialogs/kityformula-mathjax.html?' + array.join('&')
    }
  }

  function existPlaceholder (latex) {
    return latex.trim().indexOf('\\placeholder') > -1;
  }

  return {
    title: localeObj[localeMach(localStorage.lang)]['公式编辑器'],
    minWidth: width,
    minHeight: height,
    resizable: CKEDITOR.DIALOG_RESIZE_NONE,
    contents: [{
      id: 'editor-tab',
      elements: [{
        id: 'editor-element',
        type: 'html',
        // html: '<div style="width:'+width+'px;height:'+height+'px;"><iframe style="width:'+width+'px;height:'+height+'px;" frameborder="no" scrolling="no" src="' + CKEDITOR.basePath + 'plugins/kityformula/dialogs/kityformula-mathjax.html"></iframe></div>',
        html: '<div><iframe style="width:' + width + 'px;height:' + height + 'px;" frameborder="no" scrolling="no" src="' + getIFrameSrc() + '"></iframe></div>',
        setup: function (widget) {
          var ok = CKEDITOR.dialog.okButton;

          var iframeWindow = getIFrame.call(this).contentWindow;
          iframeWindow.parent.currentLatex = CKEDITOR.plugins.mathjax.trim(widget.data.math);

          // console.log("current latex:"+iframeWindow.parent.currentLatex);

          // 修复bug #5814,#5481 在某些情况下,在chrome中会出现公式编辑器页面显示空白(iframe的src会变成about:blank)
          // iframeWindow.location.reload();
          iframeWindow.location.replace(getIFrameSrc());
        },
        commit: function (widget) {
          var latex = getIFrame.call(this).contentWindow.getLatexData();
          if (existPlaceholder(latex)) {
            alert(localeObj[localeMach(localStorage.lang)]['公式不完整']);
          } else {
            widget.setData('math', '\\(' + latex + '\\)');
          }
        }
      }]
    }],
    onOk: function () {
      var dialog = this;
      var latex = getIFrame.call(dialog.getContentElement('editor-tab', 'editor-element')).contentWindow.getLatexData();
      if (existPlaceholder(latex)) {
        return false;
      }
      return true;
    }
  };
});
