/**
 * 配置信息，包括用户设置和操作缓存
 *
 * Created by jzj on 2018/12/23.
 */
'use strict'

const fs = require('fs')
const Store = require('electron-store')
const Base64 = require('js-base64').Base64

// user settings, will be cleared if clear settings options is clicked
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

function decodeSites(sites) {
  return sites && sites.map(site => {
    return {
      ...site,
      password: site.password && Base64.decode(site.password)
    }
  })
}

function encodeSites(sites) {
  return sites && sites.map(site => {
    return {
      ...site,
      password: site.password && Base64.encode(site.password)
    }
  })
}

export function getSites() {
  return decodeSites(settings.get('sites', defaultSites))
}

export function saveSites(sites) {
  settings.set('sites', encodeSites(sites))
}

export function getPublishMode(defaultValue = 'manual') {
  return settings.get('publish.mode', defaultValue);
}

export function savePublishMode(publishMode) {
  settings.set('publish.mode', publishMode);
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
