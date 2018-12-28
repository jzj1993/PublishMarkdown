/**
 * Created by jzj on 2018/12/23.
 */
'use strict'

const fs = require('fs')
const Store = require('electron-store')

// user settings
const settings = new Store({name: 'settings'})
// other config data
const config = new Store()

export function clearSettings() {
  settings.clear()
}

export function newSite() {
  return {
    type: 'MetaWeblog',
    name: 'Sample Site Config',
    url: 'http://www.example.com/xmlrpc.php',
    username: 'username',
    password: ''
  }
}

const defaultSites = [newSite()]

export function getSites() {
  return settings.get('sites', defaultSites)
}

export function saveSites(sites) {
  settings.set('sites', sites)
}

function getHighlight() {
  return settings.get('render.highlight', 'preview')
}

function getMathjax() {
  return settings.get('render.mathjax', 'preview')
}

export function getRenderConfig() {
  return {
    highlight: getHighlight(),
    mathjax: getMathjax(),
  }
}

export function saveRenderConfig(render) {
  settings.set('render.highlight', render.highlight)
  settings.set('render.mathjax', render.mathjax)
}

export function isMathJaxEnabled() {
  const mathjax = getMathjax()
  return mathjax === 'preview' || mathjax === 'publish'
}

function shouldRender(preview, config) {
  if (preview) {
    return config === 'preview' || config === 'publish'
  } else {
    return config === 'publish'
  }
}

export function shouldRenderHighlight(preview) {
  return shouldRender(preview, getHighlight())
}

export function shouldRenderMathJax(preview) {
  return shouldRender(preview, getMathjax())
}

export function getLanguage() {
  return config.get('language', 'en')
}

export function getTabs() {
  let tabs = config.get('tabs', [{type: 'welcome'}]).filter(tab => {
    return tab.type !== 'markdown' || fs.existsSync(tab.file)
  })
  tabs.forEach(tab => {
    tab.modified = false
  })
  return tabs
}

export function getCurrentTab() {
  return config.get('tab-current', 0)
}

export function saveTabs(tabs) {
  config.set('tabs', tabs.map(tab => {
    return {type: tab.type, title: tab.title, file: tab.file}
  }))
}

export function saveCurrentTab(index) {
  config.set('tab-current', index)
}
