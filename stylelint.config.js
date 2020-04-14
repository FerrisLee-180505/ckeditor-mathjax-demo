module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-standard'
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'no-descending-specificity': null,
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'extend', 'at-root', 'debug', 'warn', 'error', 'if', 'else',
        'for', 'each', 'while', 'mixin', 'include', 'content', 'return', 'function'
      ]
    }]
  }
}
