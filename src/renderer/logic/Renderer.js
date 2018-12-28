/**
 * Created by jzj on 2018/12/11.
 */
'use strict'

const path = require('path')
const fm = require('front-matter')
const htmlToText = require('html-to-text')
const highlight = require('highlight.js')
const uslug = require('uslug')
const MarkdownIt = require('markdown-it')
const utils = require('./utils')
const MathJaxFrontRenderer = require('./MathJaxFrontRenderer')
const config = require('./config')

let md = undefined

export function notifyConfigChanged() {
  md = undefined
}

function getMd() {
  if (md) {
    return md
  }

  // https://github.com/markdown-it/markdown-it
  md = new MarkdownIt({
    html: true,
    breaks: true, // replace '\n' with <br>
    linkify: true, // auto link
  })

  // extract title from markdown
  md.use(require('markdown-it-title'))
  // underline syntax support
  md.use(require('markdown-it-underline'))
  // generate anchor for heading
  md.use(require('markdown-it-anchor'), {
    slugify: s => uslug(s)
  })
  // generate toc
  md.use(require('markdown-it-table-of-contents'), {
    markerPattern: /^\[toc]/im,
    includeLevel: [1, 2, 3, 4, 5, 6]
  })

  // mathjax preprocess
  if (config.isMathJaxEnabled()) {
    md.use(require('./modules/markdown-it-mathjax').get())
  }

  return md
}

function replaceLocalImages(div, dir) {
  const elements = div.getElementsByTagName('img')

  for (let i = 0; i < elements.length; i++) {
    const img = elements[i]
    let src = img.getAttribute('src')
    if (!src || src.match(/^((https?|file):\/\/|data:)/)) {
      continue
    }
    if (path.isAbsolute(src)) {
      img.setAttribute('src', 'file://' + src)
    }
    else {
      img.setAttribute('src', 'file://' + path.join(dir, src))
    }
  }
}

function createInvisibleDiv(document, src) {
  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.height = '0'
  div.style.width = '100%'
  div.style.overflowY = 'hidden'
  div.style.left = '0'
  div.style.top = '0'
  div.innerHTML = src
  return div
}

function getTime() {
  return window.performance ? window.performance.now() : Date.now()
}

function highlightCode(div) {
  const elements = div.querySelectorAll('pre code')
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      const code = elements[i]
      highlight.highlightBlock(code)
    }
  }
}

function toSystemTimezone(date) {
  const timezoneOffset = new Date().getTimezoneOffset()
  const time = date.getTime()
  date.setTime(time + timezoneOffset * 60 * 1000)
  // console.log('old time, new time, offset =', time, date.getTime(), timezoneOffset)
  return date
}

/**
 * @param src file content
 * @param file file path
 * @param preview true: preview, false: publish
 * @return {Promise<*>}
 */
export async function render(src, file, preview = true) {
  const startTime = getTime()

  src = src && src.trim() || ''

  // meta
  const content = fm(src)
  const markdown = content.body
  const attr = content.attributes || {}
  attr.title = utils.toStr(attr.title)
  attr.abstract = utils.toStr(attr.abstract)
  attr.url = attr.url && uslug(utils.toStr(attr.url))
  attr.tags = utils.toStrArr(attr.tags || attr.tag)
  attr.categories = utils.toStrArr(attr.categories || attr.category)
  attr.authors = utils.toStrArr(attr.authors || attr.author)
  attr.date = attr.date && toSystemTimezone(attr.date)

  // markdown: html, title
  const env = {title: attr.title, hasMath: false}
  let html = getMd().render(markdown, env)

  const div = createInvisibleDiv(document, html)

  // local image files
  replaceLocalImages(div, path.dirname(file))
  // highlight
  if (config.shouldRenderHighlight(preview)) {
    await highlightCode(div)
  }
  // mathjax
  if (env.hasMath && config.shouldRenderMathJax(preview)) {
    document.body.appendChild(div)
    await MathJaxFrontRenderer.typeset(window, div)
    document.body.removeChild(div)
  }

  html = div.innerHTML
  div.innerHTML = ''

  // post
  const post = {}
  post.file = file
  post.src = src
  post.markdown = markdown
  post.title = env.title || utils.fileName(file) || 'Unnamed'
  post.html = html
  post.abstract = attr.abstract || htmlToText.fromString(html, {wordwrap: false}).substr(0, 100)

  post.url = attr.url // || encodeURI(post.title)
  post.tags = attr.tags
  post.categories = attr.categories
  post.authors = attr.authors
  post.date = attr.date

  console.log(`render post '${post.title}' cost ${getTime() - startTime} ms`)

  return post
}
