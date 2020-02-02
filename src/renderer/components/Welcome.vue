<!-- 欢迎页面 -->

<template>
  <div class="container">
    <div class="markdown-body">
      <div v-html="$t('introduction')" ref="introduction"></div>
    </div>

  </div>
</template>

<script>

  const utils = require('../logic/utils')

  export default {
    name: 'Welcome',
    methods: {
      setLinks() {
        const ref = this.$refs['introduction']
        utils.setLinks(ref)
      },
    },
    mounted() {
      this.setLinks()
    },
    updated() {
      this.setLinks()
    }
  }
</script>

<style lang="scss" scoped>

  .container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 50px;
    box-sizing: border-box;
  }

</style>
