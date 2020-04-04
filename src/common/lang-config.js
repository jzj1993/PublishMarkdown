/**
 * language config
 *
 * Created by jzj on 2020-04-04.
 */
'use strict'

const Store = require('electron-store')
const store = new Store({name: 'settings'})

export function getLanguage() {
  return store.get('language', 'zh')
}

export function setLanguage(lang) {
  return store.set('language', lang)
}
