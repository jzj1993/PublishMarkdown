/**
 * Created by jzj on 2018/12/16.
 */
'use strict'

const path = require('path')
const {remote, shell} = require('electron')
const config = require('./config')

export function fileName(file) {
  return path.basename(file, '.md')
}

export function toStr(src) {
  return src && typeof src === 'string' && src || null
}

export function toStrArr(src) {
  if (src) {
    if (typeof src === 'string') {
      return [src]
    } else if (src instanceof Array) {
      return src.map(s => toStr(s)).filter(s => s)
    }
  }
  return null
}

const sampleFile = path.join(__static, 'sample.md')

export function isSampleFile(file) {
  return file === sampleFile
}

export function getSampleFile() {
  return sampleFile
}

export function openSampleFile() {
  remote.getCurrentWebContents().send('menu.sample')
}

export function openSettings() {
  remote.getCurrentWebContents().send('menu.settings')
}

function linkListener(e) {
  // console.log('linkListener')
  const attribute = this.getAttribute('data-href')
  if (attribute) {
    switch (attribute) {
      case 'settings':
        e.preventDefault()
        openSettings()
        return
      case 'sample':
        e.preventDefault()
        openSampleFile()
        return
    }
  }
  const href = this.href
  if (href && /^https?:\/\//.test(href)) {
    e.preventDefault()
    shell.openExternal(href)
  }
}

export function setLinks(node) {
  if (node) {
    const elements = node.getElementsByTagName('a')
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        const a = elements[i]
        a.removeEventListener('click', linkListener)
        a.addEventListener('click', linkListener, false)
      }
    }
  }
}

export function setTextareaTabKey(textarea) {
  if (textarea) {
    textarea.onkeydown = function (e) {
      if (e.keyCode === 9 || e.which === 9) {
        e.preventDefault()
        const s = this.selectionStart
        this.value = this.value.substring(0, this.selectionStart)
          + '\t' + this.value.substring(this.selectionEnd)
        this.selectionEnd = s + 1
      }
    }
  }
}
