<!-- 主窗口，包含标签栏，页面容器，状态栏 -->

<template>

  <div class="root">

    <div class="tab-titles">
      <TabTitle v-for="(tab, i) in tabs"
                :key="i"
                :tab-title="tabTitle(tab)"
                :selected="current === i"
                :tab-click="() => selectTab(i)"
                :tab-close="() => closeTab(i)"
                :modified="tab.modified">
      </TabTitle>
    </div>

    <div class="tab-contents">
      <div class="tab-content" v-for="(tab, i) in tabs" v-show="current === i">

        <template v-if="tab.type === 'welcome'">
          <Welcome></Welcome>
        </template>

        <template v-else-if="tab.type === 'markdown'">
          <Markdown
            :file="tab.file"
            :active="current === i"
            :modified-handler="(m) => {setModified(tab, m)}">
          </Markdown>
        </template>

        <template v-else-if="tab.type === 'settings'">
          <Settings
            :active="current === i">
          </Settings>
        </template>

      </div>
    </div>

    <div class="status-bar" v-if="statusText">{{ statusText }}</div>

  </div>

</template>

<script>
  import Markdown from './Markdown'
  import Settings from './Settings'
  import Welcome from './Welcome'
  import TabTitle from './TabTitle'
  import {ipcRenderer, remote} from 'electron'

  const fs = require('fs')
  const utils = require('../logic/utils')
  const config = require('../logic/config')
  const statusBar = require('../logic/statusBar')

  export default {
    name: 'Main',
    components: {TabTitle, Welcome, Settings, Markdown},
    data() {
      return {
        tabs: config.getTabs(),
        current: config.getCurrentTab(),
        statusText: null
      }
    },
    watch: {
      tabs() {
        config.saveTabs(this.tabs)
        console.log('save tab info')
      },
      current() {
        config.saveCurrentTab(this.current)
      }
    },
    mounted() {
      // console.log('tabs', this.tabs)

      statusBar.handle(text => {
        this.statusText = text
      })

      ipcRenderer.on('menu.open', (event, file) => {
        console.log('menu.open', file)
        this.openFile(file)
      })

      ipcRenderer.on('menu.settings', () => {
        console.log('menu.settings')

        const index = this.tabs.findIndex(tab => tab.type === 'settings')
        if (index === -1) {
          this.addTab({type: 'settings'})
        } else {
          this.selectTab(index)
        }
      })

      ipcRenderer.on('menu.welcome', () => {
        console.log('menu.welcome')

        const index = this.tabs.findIndex(tab => tab.type === 'welcome')
        if (index === -1) {
          this.addTab({type: 'welcome'})
        } else {
          this.selectTab(index)
        }
      })

      ipcRenderer.on('menu.sample', () => {
        console.log('menu.sample')
        this.openFile(utils.getSampleFile())
      })

      const globalData = remote.getGlobal('globalData')
      console.log('globalData', globalData)
      if (globalData.fileToOpen) {
        this.openFile(globalData.fileToOpen)
        globalData.fileToOpen = null
      } else if (remote.process.platform === 'win32' && remote.process.argv.length >= 2) {
        const file = remote.process.argv[1]
        if (file) {
          this.openFile(file)
        }
      }
    },
    methods: {
      openFile(file) {
        const index = this.tabs.findIndex(tab => tab.file === file)
        if (index === -1) {
          if (fs.existsSync(file)) {
            remote.app.addRecentDocument(file)
            this.addTab({
              type: 'markdown',
              file: file,
              title: utils.fileName(file),
              modified: false,
            })
          } else {
            statusBar.show(this.$t('readFileNotExists') + file)
          }
        } else {
          this.selectTab(index)
        }
      },
      tabTitle(tab) {
        switch (tab.type) {
          case 'settings':
            return this.$i18n.t('settings')
          case 'welcome':
            return this.$i18n.t('welcome')
          case 'markdown':
            return tab.title
        }
      },
      setModified(tab, modified) {
        this.$set(tab, 'modified', modified)
      },
      selectTab(index) {
        console.log('select tab:', this.current, '=>', index)
        this.current = index
      },
      addTab(tab) {
        const pos = Math.min(this.current + 1, this.tabs.length)
        this.tabs.splice(pos, 0, tab)
        this.current = pos
      },
      closeTab(index) {
        const tab = this.tabs[index]
        if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
          if (!window.confirm(this.$t('closeModifiedFile'))) {
            return
          }
        }
        if (this.tabs.length <= 1) {
          this.tabs = [{type: 'welcome'}]
          this.current = 0
          return
        }
        if (index === this.current) {
          this.current = Math.max(0, index - 1)
        } else if (index < this.current) {
          this.current = this.current - 1
        }
        this.tabs.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../assets/style";

  .root {
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
  }

  .tab-titles {
    background-color: #EEE;
    padding: 3px 3px 0 3px;
    height: 30px;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tab-contents {
    height: 0;
    flex-grow: 1;
  }

  .tab-content {
    width: 100%;
    height: 100%;
  }

  .status-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    min-width: 30%;
    max-width: 95%;
    padding: 2px 10px;

    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9em;
    color: #666;

    background-color: white;
    border-top-right-radius: 3px;
    border-right: 1px solid #BBB;
    border-top: 1px solid #BBB;
    box-shadow: rgba(128, 128, 128, 0.3) 0 0 50px 0;
  }

</style>
