const fs = require('fs')
const StyleDictionaryPackage = require('style-dictionary')
const _ = require('lodash')

const dist = './dist'

// DYNAMIC CONFIGURATION
const getStyleDictionaryConfig = () => ({
  source: ['./tokens/**/*.json'],
  action: {
    buildSketch: {
      do: require('./sketch'),
      undo: () => console.log('no undo'),
    },
  },
  platforms: {
    'web/json': {
      transformGroup: 'tokens',
      buildPath: `${dist}/`,
      files: [{
        'destination': 'tokens.json',
        'format': 'json/flat'
      }]
    },
    'web/ts': {
      transformGroup: 'tokens',
      buildPath: `${dist}/`,
      files: [{
        'destination': 'tokens.ts',
        'format': 'typescript/es6'
      }]
    },
    sketch: {
      transformGroup: 'tokens',
      buildPath: `${dist}/`,
      actions: ['buildSketch'],
    },
  },
})

// REGISTER CUSTOM TRANSFORM
StyleDictionaryPackage.registerTransform({
  name: 'typography/sizeToPx',
  type: 'value',
  matcher: prop => {
    return prop.attributes.category === 'typography' && ['font_size', 'line_height'].includes(prop.attributes.item)
  },
  transformer: prop => prop.value + 'px',
})

// REGISTER CUSTOM TRANSFORM GROUPS
StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens',
  transforms: ['attribute/cti', 'name/ti/camel', 'typography/sizeToPx'],
})

// REGISTER CUSTOM FORMATS
StyleDictionaryPackage.registerFormat({
  name: 'json/flat',
  formatter: dictionary => JSON.stringify(dictionary, null, 2),
})

StyleDictionaryPackage.registerFormat({
  name: 'typescript/es6',
  formatter: _.template(fs.readFileSync('templates/ts.template'))
})

// PROCESSING
console.log('Build started...')
console.log('\n==============================================')
console.log('\nProcessing:')

const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig())

StyleDictionary.buildAllPlatforms()

console.log('\n==============================================')
console.log('\nBuild completed!')
