<template>

  <div class="container">
    <div class="settings markdown-body">

      <h2>{{ $t('settings') }}</h2>

      <h3>{{ $t('setting.siteSettings') }}</h3>

      <blockquote class="small" v-html="$t('setting.siteSettingsNote')"></blockquote>

      <template v-if="sites">
        <div v-for="(site, i) in sites" class="site">

          <div>
            <label for="name">{{ $t('setting.name') }}</label>
            <input id="name" type="text" v-model="site.name"/>
          </div>

          <div>
            <label for="type">{{ $t('setting.apiType') }}</label>
            <select id="type" v-model="site.type">
              <option value="MetaWeblog">MetaWeblog</option>
            </select>
          </div>

          <div>
            <label for="url">{{ $t('setting.url') }}</label>
            <input id="url" type="url" v-model="site.url"/>
          </div>

          <div>
            <label for="username">{{ $t('setting.username') }}</label>
            <input id="username" type="text" v-model="site.username"/>
          </div>

          <div>
            <label for="password">{{ $t('setting.password') }}</label>
            <input id="password" type="password" v-model="site.password"/>
          </div>

          <img @click="deleteSite(i)" :src="require('../assets/close.png')" class="delete">

        </div>
      </template>

      <p class="buttons">
        <button @click="addSite">{{ $t('setting.addSite') }}</button>
      </p>

      <h3>{{ $t('setting.renderSettings') }}</h3>

      <p>
        <label for="highlight">{{ $t('setting.highlight') }}</label>
        <select id="highlight" v-model="render.highlight">
          <option value="preview">{{ $t('setting.previewOnly') }}</option>
          <option value="publish">{{ $t('setting.previewAndPublish') }}</option>
          <option value="none">{{ $t('setting.disable') }}</option>
        </select>
      </p>

      <p>
        <label for="math">{{ $t('setting.mathjax') }}</label>
        <select id="math" v-model="render.mathjax">
          <option value="preview">{{ $t('setting.previewOnly') }}</option>
          <option value="publish">{{ $t('setting.previewAndPublish') }}</option>
          <option value="none">{{ $t('setting.disable') }}</option>
        </select>
      </p>

      <blockquote class="small" v-html="$t('setting.renderSettingsNote')"></blockquote>

      <h3>{{ $t('setting.otherSettings') }}</h3>

      <p class="buttons">
        <button @click="resetSettings">{{ $t('setting.reset') }}</button>
      </p>

    </div>
  </div>

</template>

<script>

  import {ipcRenderer} from 'electron'

  const debounce = require('lodash.debounce')
  const config = require('../logic/config')
  const Renderer = require('../logic/Renderer')

  export default {
    name: 'Settings',
    props: ['active'],
    data() {
      return {
        sites: config.getSites(),
        render: config.getRenderConfig(),
      }
    },
    async mounted() {
      ipcRenderer.on('menu.save', () => {
        if (this.active) {
          this.save()
        }
      })
    },
    watch: {
      sites: {
        handler() {
          // console.log('sites')
          this.debounceSaveSites()
        },
        deep: true
      },
      render: {
        handler() {
          config.saveRenderConfig(this.render)
          Renderer.notifyConfigChanged()
          console.log('render settings saved')
        },
        deep: true
      },
    },
    methods: {
      debounceSaveSites: debounce(function () {
        config.saveSites(this.sites)
        console.log('sites settings saved')
      }, 500),
      addSite() {
        this.sites.push(config.newSite())
        // console.log('add site', this.sites)
      },
      deleteSite(index) {
        if (window.confirm('确认删除？')) {
          this.sites.splice(index, 1)
          // console.log('delete site', this.sites)
        }
      },
      resetSettings() {
        if (window.confirm(this.$t('setting.resetConfirm'))) {
          config.clearSettings()
          this.sites = config.getSites()
          this.render = config.getRenderConfig()
        }
      }
    }
  }

</script>

<style lang="scss" scoped>

  .container {
    width: 100%;
    height: 100%;
    overflow: scroll;
    box-sizing: border-box;
  }

  .settings {
    padding: 60px 20px;
    width: 600px;
    margin: auto;
    max-width: 100%;
  }

  .site {
    position: relative;
    padding: 15px 40px 15px 20px;
    border: 1px solid #DDD;
    margin-bottom: 20px;
    font-size: 85%;
    background-color: #F8F8F8;

    > div + div {
      margin-top: 8px;
    }

    div {
      display: flex;
      flex-direction: row;
    }

    label {
      display: inline-block;
      width: 80px;
      padding: 3px 0;
    }

    input {
      flex-grow: 1;
      width: 0;
      outline: none;
      border: 1px solid #E0E0E0;
      padding: 2px 5px;
    }
  }

  select {
    outline: none;
  }

  .render {
    > *:not(:first-child) {
      margin-top: 15px;
    }
  }

  .delete {
    background-color: transparent;
    padding: 5px;
    height: 20px;
    width: auto;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  small, .small {
    font-size: 85%;
  }

  .buttons {
    text-align: center;
  }

</style>
