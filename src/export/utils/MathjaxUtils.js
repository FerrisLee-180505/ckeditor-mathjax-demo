export default function (element) {
  if (window.MathJax) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, element])
  }
}