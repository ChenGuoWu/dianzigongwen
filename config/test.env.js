'use strict'
// const merge = require('webpack-merge')
// const prodEnv = require('./prod.env')

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"'
// })

module.exports = {
    NODE_ENV: '"BJTEST"',
    API_ROOT: '"http://192.168.65.94:8078/carsoa-base-dmz"'
}

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"'
})