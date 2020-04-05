/**
 * user settings
 *
 * Created by jzj on 2018/12/23.
 */
'use strict'

const Store = require('electron-store')
const Base64 = require('js-base64').Base64

const store = new Store({name: 'settings'})

export function clear() {
  store.clear()
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
  const sites = store.get('sites', defaultSites)
  // decode
  return sites && sites.map(site => {
    return {
      ...site,
      password: site.password && Base64.decode(site.password)
    }
  })
}

export function saveSites(sites) {
  // encode
  sites = sites && sites.map(site => {
    return {
      ...site,
      password: site.password && Base64.encode(site.password)
    }
  })
  return store.set('sites', sites)
}

export function getPublishMode(defaultValue = 'manual') {
  return store.get('publish.mode', defaultValue)
}

export function savePublishMode(publishMode) {
  return store.set('publish.mode', publishMode)
}

export function getRenderConfig() {
  let defaultValue = {
    abstract: 'empty',
    highlight: 'preview',
    mathjax: 'preview',
    mermaid: 'preview',
  }
  let config = store.get('render', {})
  return {
    ...defaultValue,
    ...config
  }
}

export function saveRenderConfig(render) {
  return store.set('render', render)
}
