const db = require('./db')

module.exports = {
  // first web middlware of webpack-dev-server
  after: (app) => {
  },

  // last web middlware of webpack-dev-server
  before: (app, server, compiler) => {}

}