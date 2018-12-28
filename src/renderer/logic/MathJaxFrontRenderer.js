/**
 * Created by jzj on 2018/12/22.
 */
'use strict'

const {typesetMath, mathJaxPath} = require('mathjax-electron')

function insertScript({document, src = undefined, text = undefined, type = 'text/javascript'}) {
  return (src || text) && new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.type = type
      if (src) script.src = src
      if (text) script.text = text
      script.addEventListener('load', () => {
        console.log('script [' + src || text + '] load success')
        resolve()
      })
      document.getElementsByTagName('head')[0].appendChild(script)
    } catch (error) {
      console.error('script [' + src || text + '] load failure', error)
      reject(error)
    }
  })
}

async function loadMathJax(window) {
  if (typeof MathJax === 'undefined' || MathJax === null) {
    window.MathJax = {
      'fast-preview': {disabled: true},
      tex2jax: {
        preview: 'none',
        inlineMath: [['\\(', '\\)']]
      }
    }
    await insertScript({document: window.document, src: 'file://' + mathJaxPath})
  }
}

export async function typeset(window, div, timeout = 3000) {
  await loadMathJax(window)
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      console.error('typeset timeout')
      resolve()
    }, timeout)
    try {
      typesetMath(div, () => {
        clearTimeout(handle)
        resolve()
      })
    } catch (e) {
      clearTimeout(handle)
      reject(e)
    }
  })
}
