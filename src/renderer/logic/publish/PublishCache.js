/**
 * 文章、图片发布缓存，避免文章、图片重复发布
 *
 * Created by jzj on 2018/12/24.
 */
'use strict'

const Store = require('electron-store')
const md5File = require('md5-file/promise')
const _filenamify = require('filenamify')
const filenamify = (s) => _filenamify(s, {replacement: '-'})

/**
 * 缓存基类
 */
class Cache {

  constructor(type, url, user) {
    this.store = new Store({name: ['cache', type, filenamify(url), filenamify(user)].join('-')})
    console.log('cache path = ', this.store.path)
  }

  async put(object, data) {
    if (object && data) {
      const key = await this.key(object)
      if (key) {
        this.store.set(key, data)
        return true
      }
    }
    return false
  }

  async get(object) {
    if (object) {
      const key = await this.key(object)
      if (key) {
        return this.store.get(key, null)
      }
    }
    return null
  }

  async key(object) {
    return null
  }
}

/**
 * 文章缓存，避免文章重复创建（已有文章直接编辑）。根据post.url区分。
 */
export class PostCache extends Cache {

  constructor(url, user) {
    super('post', url, user)
  }

  async put(post, data) {
    return super.put(post, data)
  }

  async get(post) {
    return super.get(post)
  }

  async key(post) {
    return post && post.url || null
  }
}

/**
 * 图片缓存，避免重复上传。根据文件哈希值区分。
 */
export class FileCache extends Cache {

  constructor(url, user) {
    super('media', url, user)
  }

  async put(file, data) {
    return super.put(file, data)
  }

  async get(file) {
    return super.get(file)
  }

  async key(file) {
    return md5File(file)
  }
}
