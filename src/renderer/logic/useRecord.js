/**
 * Created by jzj on 2020-04-04.
 */
'use strict'

const fs = require('fs')
const Store = require('electron-store')

const store = new Store({name: 'use-record'})

export function getTabs() {
  let tabs = store.get('tabs', [{type: 'welcome'}]).filter(tab => {
    return tab.type !== 'markdown' || fs.existsSync(tab.file)
  })
  tabs.forEach(tab => {
    tab.modified = false
  })
  return tabs
}

export function saveTabs(tabs) {
  return store.set('tabs', tabs.map(tab => {
    return {type: tab.type, title: tab.title, file: tab.file}
  }))
}

export function getCurrentTab() {
  return store.get('tab-current', 0)
}

export function saveCurrentTab(index) {
  return store.set('tab-current', index)
}
