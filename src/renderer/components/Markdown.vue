<!-- Markdown预览页面 -->

<template>

  <div class="wrapper">

    <div class="container">

      <div class="left">
        <textarea ref="textarea" class="content" v-model="src" @input="update" title="text"></textarea>
      </div>

      <div class="right">
        <div v-show="post" class="content">

          <h1 v-if="post && post.title" class="title">{{ post.title }}</h1>

          <blockquote v-if="post && post.abstract" class="abstract"><span
            class="meta-name">{{ $t('meta.abstract') }}</span>{{ post.abstract }}
          </blockquote>

          <div class="meta" v-if="post">

            <table>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.file') }}</td>
                <td class="meta-value">{{ post.file }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.url') }}</td>
                <td class="meta-value url" v-if="post.url">{{ post.url }}</td>
                <td class="meta-value empty url" v-else>{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.time') }}</td>
                <td class="meta-value date" v-if="post.date">{{ formatDate(post.date) }}</td>
                <td class="meta-value empty" v-else>{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.categories') }}</td>
                <td class="meta-value list" v-if="post.categories">
                  <span v-for="category in post.categories" class="category">{{ category }}</span>
                </td>
                <td class="meta-value empty" v-else>{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.tags') }}</td>
                <td class="meta-value list" v-if="post.tags">
                  <span v-for="tag in post.tags" class="tag">{{ tag }}</span>
                </td>
                <td class="meta-value empty" v-else>{{ $t('meta.empty') }}</td>
              </tr>

            </table>
          </div>

          <div class="markdown markdown-body" ref="markdown" v-html="post && post.html"></div>
        </div>
      </div>
    </div>

    <Publish :post="post" :active="active"></Publish>

  </div>

</template>

<script>

  import {ipcRenderer} from 'electron'

  const fs = require('fs')
  const dateFormat = require('dateformat')
  const debounce = require('lodash.debounce')
  const utils = require('../logic/utils')
  const renderer = require('../logic/renderer')
  import Publish from './Publish'
  import * as statusBar from '../logic/statusBar'

  export default {
    name: 'Markdown',
    components: {Publish},
    props: ['file', 'active', 'modifiedHandler'],
    data() {
      return {
        modified: false,
        src: '',
        post: null
      }
    },
    async mounted() {
      utils.setTextareaTabKey(this.$refs['textarea'])
      this.readFile()
      ipcRenderer.on('menu.save', this.onSave)
    },
    watch: {
      async file() {
        this.readFile()
      },
      async src() {
        this.debounceUpdate()
      },
      modified() {
        this.modifiedHandler && this.modifiedHandler(this.modified)
      }
    },
    async updated() {
      const markdown = this.$refs['markdown']
      utils.setLinks(markdown)
    },
    methods: {
      debounceUpdate: debounce(async function () {
        console.log('debounce update')
        this.post = await renderer.render(this.src, this.file, true)
      }, 300, {leading: true}),
      onSave() {
        console.log('menu.save')
        if (this.active && this.modified) {
          this.writeFile()
        }
      },
      readFile() {
        fs.readFile(this.file, {encoding: 'utf-8'}, (err, result) => {
          if (err) {
            console.error(err)
            const text = this.$t('readFileError') + err.message
            statusBar.show(text)
            this.src = text
          } else {
            this.src = result
          }
        })
      },
      writeFile() {
        if (utils.isSampleFile(this.file)) {
          statusBar.show(this.$t('cannotWriteSampleFile'))
          return
        }
        fs.writeFile(this.file, this.src, {encoding: 'utf-8'}, (err) => {
          // do nothing
          if (!err) {
            this.modified = false
            console.log('write file success', this.file)
            statusBar.show(this.$t('saveFileSuccess'))
          } else {
            console.error(err)
            statusBar.show(this.$t('saveFileError') + err.message)
          }
        })
      },
      update() {
        this.modified = true
      },
      formatDate(date) {
        return dateFormat(date, 'yyyy-mm-dd HH:MM:ss')
      },
    }
  }
</script>

<style lang="scss" scoped>

  /*@import "../assets/MathJax.css";*/
  @import "~highlight.js/styles/github.css";

  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    > * {
      position: absolute;
      left: 0;
      top: 0;

      width: 100%;
      height: 100%;
    }
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .left, .right {
    width: 0;
    flex-grow: 1;
  }

  .left {
    overflow: hidden;
    border-right: 1px solid #CCC;
  }

  .right {
    overflow: scroll;
  }

  textarea {
    width: 100%;
    height: 100%;

    margin: 0;
    border: none;
    outline: none;
    resize: none;
  }

  .content {
    padding: 40px;
    box-sizing: border-box;
  }

  .markdown {
    width: 100%;
    height: auto;
  }

  .abstract {
    margin: 15px 0 25px 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;

    .meta-name {
      margin-right: 20px;
    }
  }

  .meta {
    width: 100%;
    overflow-x: scroll;
    margin-top: 20px;
    margin-bottom: 50px;

    table {
      width: 98%;
      box-sizing: border-box;
      border: 1px solid #EEE;
      background-color: #F8F8F8;
      border-spacing: 20px 15px;

      * {
        background: transparent;
        vertical-align: top;
        text-align: left;
      }
    }
  }

  .meta-item {

  }

  .meta-name {
    color: #555;
    font-weight: 500;
    white-space: nowrap;
  }

  .meta-value {
    word-break: break-all;
  }

  @mixin float-left {
    float: left;
    white-space: nowrap;
    margin-bottom: 5px;
    overflow-x: hidden;
    max-width: 100%;
    text-overflow: ellipsis;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }

  .category {
    @include float-left;

    text-decoration-style: solid;
    text-decoration: underline;
  }

  .tag {
    @include float-left;

    border: 1px solid;
    border-radius: 2px;
    padding: .15em .3em;
    font-size: 0.8em;
    color: #666;
  }

  .meta-value.url.empty {
    color: red;
  }

</style>
