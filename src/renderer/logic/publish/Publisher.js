/**
 * Created by jzj on 2018/12/24.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const request = require('request')
const {JSDOM} = require('jsdom')

import * as Renderer from '../Renderer'

export const STATE_RENDER = 'render'
export const STATE_READ_POST = 'read'
export const STATE_UPLOAD_MEDIA = 'upload'
export const STATE_PUBLISH_POST = 'publish'
export const STATE_EDIT_POST = 'edit'
export const STATE_COMPLETE = 'complete'

/**
 * https://codex.wordpress.org/Function_Reference/get_allowed_mime_types
 */
export const MEDIA_MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  bmp: 'image/bmp',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  ico: 'image/x-icon',
}

export function getMimeType(file) {
  let ext = path.extname(file)
  ext = ext && ext.length > 1 && ext.substr(1) || '' // jpg
  const type = MEDIA_MIME_TYPES[ext]
  if (!type) {
    throw new Error(`[${file}]  media ext '${ext}' not supported`)
  }
  return type
}

export function readFileBits(file) {
  return new Promise((resolve, reject) => {
    require('fs').readFile(file, {encoding: null}, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export function checkUrlValid(url) {
  return url && new Promise((resolve, reject) => {
    request.head(url, function (error, response, body) {
      resolve(!error && response && response.statusCode === 200)
    })
  })
}

export class Publisher {

  /**
   *
   * @param post
   * @param stateHandler
   * @param publishMode 'manual' | 'create' | 'auto'
   * @param mediaMode 'create' | 'cache'
   * @param editHandler
   * @return {Promise<boolean>} true: published, false: cancelled
   */
  async publish({post, stateHandler, publishMode, mediaMode, editHandler}) {

    const _stateHandler = stateHandler
    stateHandler = (state) => {
      console.log(state)
      _stateHandler && _stateHandler(state)
    }

    stateHandler(STATE_RENDER)

    // render post in publish mode
    post = await Renderer.render(post.src, post.file, false)
    console.log('post = ', post)

    stateHandler(STATE_READ_POST)

    let oldPost = null
    switch (publishMode) {
      case 'auto':
        oldPost = await this.getOldPost(post)
        break

      case 'manual':
        if (editHandler) {
          const _oldPost = await this.getOldPost(post)
          if (await editHandler(_oldPost)) {
            oldPost = _oldPost
          }
        }
        break

      case 'create':
        break
    }
    console.log('old post = ', oldPost)

    stateHandler(STATE_UPLOAD_MEDIA)

    const jsdom = new JSDOM()
    const div = jsdom.window.document.createElement('div')
    div.innerHTML = post.html

    await Promise.map(Array.from(div.getElementsByTagName('img')), async (img) => {
      const src = img.getAttribute('src')
      if (src && src.startsWith('file://')) {
        const file = decodeURI(src.substr('file://'.length))
        if (fs.existsSync(file)) {
          const url = await this.uploadMedia(file, mediaMode)
          if (url) {
            img.setAttribute('src', url)
          } else {
            console.error(`media process failure`, file)
          }
        } else {
          console.error(`media not exists`, file)
        }
      }
    }, {concurrency: 5})
    post.html = div.innerHTML

    if (oldPost) {
      stateHandler(STATE_EDIT_POST)
      await this.editPost(oldPost, post)
    } else {
      stateHandler(STATE_PUBLISH_POST)
      await this.newPost(post)
    }

    stateHandler(STATE_COMPLETE)
    return true
  }

  /**
   * get old post by url
   * @param post post to publish
   */
  getOldPost(post) {

  }

  /**
   * create new post & cache post info if necessary
   * @param post
   */
  newPost(post) {

  }

  /**
   * edit post
   * @param oldPost
   * @param post
   */
  editPost(oldPost, post) {

  }

  /**
   * upload media or reuse from cache
   * @param file
   * @param mediaMode
   * @return Promise<string> url
   */
  uploadMedia(file, mediaMode) {

  }
}
