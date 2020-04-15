import $script from 'scriptjs'

// if we need mathjaxUtils, we should load js first.
$script('http://cdncs.101.com/v0.1/static/dist_learningobjectives_editor/mubiao-static/lib/MathJax/MathJax.js?config=TeX-AMS-MML_SVG-full,local/local')

export default function (element) {
  if (window.MathJax) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, element])
  }
}