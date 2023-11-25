// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ['axios', 'vue-router'],
  lintOnSave: false,
  
})
