process.env.VUE_APP_API_ENDPOINT = 'http://localhost:3000/'

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [
            "./node_modules"
          ]
        }
      }
    }
  }
};
