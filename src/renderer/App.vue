<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  const {ipcRenderer} = require('electron')
  const lang = require('./logic/lang')

  export default {
    name: 'PublishMarkdown',
    created() {
      ipcRenderer.on('menu.language', (event, language) => {
        lang.setLanguage(this, language)
      })
    }
  }
</script>

<style lang="scss">

  @import "~github-markdown-css/github-markdown.css";

  /* CSS */
  #app {
    height: 100%;
  }
</style>
