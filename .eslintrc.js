const config = require('@bszhct/template-eslint/lib/eslint-node')

const eslint = JSON.parse(JSON.stringify(config))
eslint.parserOptions.project = false

module.exports = eslint
