/**
 * MathJax front renderer. Render mathjax code into math formula in browser enverionment.
 *
 * Created by jzj on 2018/12/22.
 */
'use strict'

const {typesetMath, mathJaxPath} = require('mathjax-electron')
const {loadScript} = require('../utils')

async function loadMathJax() {
  if (typeof MathJax === 'undefined' || MathJax === null) {
    window.MathJax = {
      'fast-preview': {disabled: true},
      tex2jax: {
        preview: 'none',
        inlineMath: [['\\(', '\\)']]
      }
    }
    await loadScript({document, src: 'file://' + mathJaxPath})
  }
}

export async function render(container, timeout = 3000) {
  await loadMathJax()
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      console.error('typeset timeout')
      resolve()
    }, timeout)
    try {
      typesetMath(container, () => {
        clearTimeout(handle)
        resolve()
      })
    } catch (e) {
      clearTimeout(handle)
      reject(e)
    }
  })
}
