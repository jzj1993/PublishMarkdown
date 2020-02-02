<!-- 发布窗口 -->

<template>

  <div class="publish-wrapper" v-if="showPublish">

    <div class="overlay"></div>

    <div class="dialog publish-container">

      <div class="dialog-title">
        <h4>{{ $t('publish.title') }}</h4>
        <img @click="closePublish" :src="require('../assets/close.png')">
      </div>

      <div class="dialog-body">
        <div class="publish-sites">
          <div class="publish-site-text">
            <span>{{ $t('publish.selectSites') }}</span>
            <a class="publish-site-edit" href="#" @click="showSettings()">{{ $t('publish.settings') }}</a>
          </div>
          <div class="sites">
            <div v-for="site in sites" class="site" @click="() => select(site)">
              <input title="select" type="checkbox" v-model="site.selected">
              <div class="site-info">
                <div class="site-name"><h4>{{ site.name }}</h4></div>
                <div class="site-detail">
                  <span><small>{{ site.username }}</small></span>
                  <span><small>{{ site.url }}</small></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="publish-mode">
          <label for="publish-mode-select">{{ $t('publish.publishMode') }}</label>
          <select id="publish-mode-select" v-model="publishMode">
            <option value="manual">{{ $t('publish.publishModeManual') }}</option>
            <option value="create">{{ $t('publish.publishModeCreate') }}</option>
            <option value="auto">{{ $t('publish.publishModeAuto') }}</option>
          </select>
          <div class="publish-mode-hint">{{ $t('publish.publishModeHint') }}</div>
        </div>

        <div class="buttons">
          <button @click="publish" :disabled="publishing">
            {{ publishing ? $t('publish.publishing') : $t('publish.publish') }}
          </button>
        </div>

      </div>

    </div>

    <template v-if="editList && editList.length > 0">
      <div class="dialog publish-edit" v-for="edit in editList" v-if="edit">
        <div class="dialog-title">
          <h4>{{ $t('publish.publishModeConfirm') }}</h4>
        </div>
        <div class="dialog-body">
          <div class="site-detail" v-if="edit.site">
            <span>{{ edit.site.name }}</span>
            <span>{{ edit.site.username }}</span>
            <span>{{ edit.site.url }}</span>
          </div>
          <div>{{ $t('publish.publishModeOldPost') }}</div>
          <div class="post-preview markdown-body" v-if="edit.post">
            <h1 class="post-preview-title">{{ edit.post.title }}</h1>
            <div class="post-preview-content" v-html="edit.post.html"></div>
          </div>
          <div class="buttons">
            <button @click="() => edit.callback(true)">{{ $t('publish.publishModeEditPost') }}</button>
            <button @click="() => edit.callback(false)">{{ $t('publish.publishModeCreatePost') }}</button>
          </div>
        </div>
      </div>
    </template>

    <div class="dialog publish-confirm" v-if="confirm && confirm.title">
      <div class="dialog-title">
        <h4>{{ confirm.title }}</h4>
      </div>
      <div class="dialog-body">
        <div class="publish-confirm-message weighted">{{ confirm.message }}</div>
        <div class="buttons">
          <button v-if="confirm.no" @click="confirm.no.callback">{{ confirm.no.message }}</button>
          <button v-if="confirm.neutral" @click="confirm.neutral.callback">{{ confirm.neutral.message }}</button>
          <button v-if="confirm.yes" @click="confirm.yes.callback">{{ confirm.yes.message }}</button>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

  import {remote, ipcRenderer} from 'electron'
  import {PostPublisher} from '../logic/publish'
  import {openSampleFile} from '../logic/utils'

  const Promise = require('bluebird')
  const config = require('../logic/config')

  function siteToString(site) {
    return `${site.name} [${site.username}] [${site.url}]`
  }

  export default {
    name: 'Publish',
    props: ['post', 'active'],
    data() {
      return {
        publishMode: 'manual',
        showPublish: false,
        sites: [],
        editList: [],
        publishing: false,
        confirm: {
          title: null,
          message: null,
          yes: null,
          no: null,
          neutral: null
        }
      }
    },
    watch: {
      publishMode() {
        console.log('publishMode', this.publishMode)
      }
    },
    mounted() {
      ipcRenderer.on('menu.publish', () => {
        if (this.active && this.post) {
          this.sites = config.getSites()
          this.showPublish = true
          if (!this.post.url) {
            this.confirm = {
              title: this.$t('publish.confirmUrlTitle'),
              message: this.$t('publish.confirmUrlMessage'),
              yes: {
                message: this.$t('publish.confirmUrlContinue'),
                callback: () => {
                  this.confirm = null
                }
              },
              neutral: {
                message: this.$t('publish.confirmUrlOpenSample'),
                callback: () => {
                  openSampleFile()
                  this.showPublish = false
                }
              },
              no: {
                message: this.$t('publish.confirmUrlCancel'),
                callback: () => {
                  this.showPublish = false
                }
              },
            }
          }
        }
      })
    },
    methods: {
      select(site) {
        this.$set(site, 'selected', !Boolean(site.selected))
      },
      async publish() {
        this.publishing = true

        // save sites selection
        config.saveSites(this.sites)

        // publish
        const selectedSites = this.sites.filter(site => site.selected)
        let success = 0
        await Promise.map(selectedSites, site => {
          return new PostPublisher(site).publish({
            post: this.post,
            publishMode: this.publishMode,
            mediaMode: 'cache',
            editHandler: (post) => this.editHandler(site, post)
          }).then(published => {
            if (published) {
              success++
              new Notification(this.$t('publishSuccess'), {body: siteToString(site)})
            }
          }).catch(e => {
            new Notification(this.$t('publishError'), {body: siteToString(site) + '\n' + e.message})
            console.error(e)
          })
        }, {concurrency: 3})

        this.publishing = false

        // all success
        if (success >= selectedSites.length) {
          this.closePublish()
        }
      },
      editHandler(site, post) {
        if (site && post) {
          return new Promise((resolve, reject) => {
            const item = {
              site,
              post,
              callback: (edit) => {
                const index = this.editList.indexOf(item)
                this.editList.splice(index, 1)
                resolve(edit)
              }
            }
            this.editList.push(item)
          })
        } else {
          return false
        }
      },
      showSettings() {
        // console.log('show settings')
        remote.getCurrentWebContents().send('menu.settings')
      },
      closePublish() {
        this.showPublish = false
      }
    }
  }
</script>

<style lang="scss" scoped>

  .dialog {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    width: 70%;
    height: 70%;
    min-width: 480px;
    min-height: 360px;

    background-color: white;

    display: flex;
    flex-direction: column;
  }

  .publish-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.7);
  }

  .post-preview {
    width: 100%;
    height: 0;
    flex-grow: 1;

    overflow-y: scroll;
    border: 1px solid #DDDDDD;
    padding: 15px;
    box-sizing: border-box;
  }

  .buttons {
    text-align: center;

    > :not(:first-child) {
      margin-left: 10px;
    }
  }

  .publish-container {

  }

  .publish-mode-hint {
    color: #666;
    font-size: 0.9em;
    margin-top: 5px;
  }

  .dialog-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 35px;

    border-bottom: 1px solid #DDDDDD;

    h4 {
      display: inline-block;
      flex-grow: 1;
      text-align: center;
    }

    img {
      padding: 8px;
      height: 19px;
      width: auto;

      &:hover {
        background-color: #DDDDDD;
      }
    }
  }

  .dialog-body {
    padding: 20px;
    height: 0;
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    > *:not(:first-child) {
      margin-top: 15px;
    }
  }

  .publish-sites {
    height: 0;
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
  }

  .publish-site-edit {
    float: right;
  }

  .sites {
    height: 0;
    flex-grow: 1;
    margin-top: 10px;

    overflow-y: scroll;
    padding: 10px;
    border: 1px solid #CCC;
    box-sizing: border-box;

    > *:not(:first-child) {
      margin-top: 15px;
    }
  }

  .site {
    background-color: #F0F0F0;
    padding: 15px;

    display: flex;
    flex-direction: row;
    align-items: center;

    > input {
      margin-right: 20px;
    }
  }

  .site-info {
    width: 0;
    flex-grow: 1;
  }

  .site-detail {
    width: 100%;
    margin-top: 5px;
    overflow-x: scroll;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }

    > *:not(:first-child) {
      margin-left: 15px;
    }
  }

  .weighted {
    height: 0;
    flex-grow: 1;
  }

</style>
