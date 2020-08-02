process.env.VUE_APP_API_ENDPOINT = 'http://localhost:4000/'

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}
