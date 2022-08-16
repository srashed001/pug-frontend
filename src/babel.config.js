// eslint-disable-next-line import/no-anonymous-default-export
export default {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        ['@babel/preset-react', {targets: {node: 'current'}}] // add this
      ]

}