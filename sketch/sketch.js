const chalk = require('chalk')
const { Sketch } = require('sketch-constructor')

const filename = 'design-tokens-demo.sketch'

module.exports =  function BuildSketchWithStyles(dictionary) {
  // Create a new sketch instance
  const sketch = new Sketch()

  // Add shared styles for all background colors
  dictionary.allProperties
    .filter(prop => prop.attributes.category === 'color')
    .forEach(prop => {
      sketch.addLayerStyle({
        name: 'colors/' + prop.name,
        fills: [
          {
            color: prop.value,
          },
        ],
      })
    })

  // dictionary.allProperties
  //   .filter(prop => prop.attributes.category === 'typography')
  //   .forEach(prop => {
  //     console.log(prop.value.replace('px', ''))

  //     const style = {
  //       name: 'typography/' + prop.name,
  //     }

  //     sketch.addTextStyle(style)
  //   })

  // Build the sketch file
  sketch.build(`./dist/${filename}`)

  console.log(`${chalk.bold.green('✔︎ ')} ./dist/${filename}`)
}
