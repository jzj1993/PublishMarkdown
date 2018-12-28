/**
 * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
 * http://xmlrpc.scripting.com/metaWeblogApi.html
 * https://github.com/uhavemyword/metaweblog-api
 *
 * Created by jzj on 2018/12/24.
 */


'use strict'

const path = require('path')
const MetaWeblog = require('metaweblog-api/lib/metaweblog-api')

import {FileCache, PostCache} from './PublishCache'
import {checkUrlValid, getMimeType, Publisher, readFileBits} from './Publisher'


export class MetaWeblogPublisher extends Publisher {

  constructor({url, username, password}) {
    super()
    this.metaWeblog = new MetaWeblog(url)
    this.blogId = ''
    this.username = username
    this.password = password
    this.postCache = new PostCache(url, username)
    this.mediaCache = new FileCache(url, username)
    console.log(url, username, password)
  }

  async getOldPost(post) {
    const oldPostId = await this.postCache.get(post)
    if (oldPostId) {
      const oldPost = await this.metaWeblog.getPost(oldPostId, this.username, this.password).catch(() => null)
      // noinspection EqualityComparisonWithCoercionJS
      if (oldPost && oldPost.postid == oldPostId) {
        return this.toPost(oldPost)
      }
    }
    return null
  }

  async newPost(post) {
    const _post = await this.toMetaWeblogPost(post)
    const id = await this.metaWeblog.newPost(this.blogId, this.username, this.password, _post, true)
    await this.postCache.put(post, id)
    return id
  }

  async editPost(oldPost, post) {
    const _post = await this.toMetaWeblogPost(post)
    const id = await this.metaWeblog.editPost(oldPost.id, this.username, this.password, _post, true)
    await this.postCache.put(post, id)
    return id
  }

  // noinspection JSMethodCanBeStatic
  toPost(mateWeblogPost) {
    return {
      id: mateWeblogPost.postid,
      title: mateWeblogPost.title,
      html: mateWeblogPost.description,
    }
  }

  // noinspection JSMethodCanBeStatic
  async toMetaWeblogPost(post) {
    // await this.checkCategoryExists(post)
    return {
      title: post.title,
      description: post.html,
      post_type: 'post',
      dateCreated: post.date,
      categories: post.categories,
      mt_keywords: post.tags,
      mt_excerpt: post.abstract,
      wp_slug: post.url,
      post_status: 'publish'
    }
  }

  async checkCategoryExists(post) {
    if (post.categories && post.categories.length > 0) {
      const oldCats = await this.metaWeblog.getCategories(this.blogId, this.username, this.password)
      for (let i = 0; i < post.categories; i++) {
        const catName = post.categories[i]
        if (oldCats.findIndex(cat => cat.description === catName) === -1) {
          return false
        }
      }
    }
    return true
  }

  async uploadMedia(file, mediaMode) {
    if (mediaMode === 'cache') {
      const url = await this.mediaCache.get(file)
      if (await checkUrlValid(url)) {
        console.log(`use cached media`)
        return url
      }
    }
    console.log(`uploading media...`)
    const bits = await readFileBits(file)
    const mediaObject = {
      name: path.basename(file),
      type: getMimeType(file),
      bits: bits,
      overwrite: false,
    }
    const result = await this.metaWeblog.newMediaObject(this.blogId, this.username, this.password, mediaObject)
    const {id, url, type} = result
    await this.mediaCache.put(file, url)
    return url
  }
}
