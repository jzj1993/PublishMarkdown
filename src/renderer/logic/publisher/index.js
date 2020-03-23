/**
 * 文章发布工具。根据type调用不同的实现。目前支持MetaWeblog。
 *
 * Created by jzj on 2018/12/7.
 */
'use strict'

import {MetaWeblogPublisher} from './MetaWeblogPublisher'

export const STATE_RENDER = 'render'
export const STATE_READ_POST = 'read'
export const STATE_UPLOAD_MEDIA = 'upload'
export const STATE_PUBLISH_POST = 'publish'
export const STATE_EDIT_POST = 'edit'
export const STATE_COMPLETE = 'complete'

export class Publisher {

  constructor({url, username, password, type}) {
    switch (type) {
      case 'MetaWeblog':
      default:
        this.publisher = new MetaWeblogPublisher({url, username, password})
        break
    }
  }

  async publish({post, stateHandler, publishMode, mediaMode, editHandler}) {
    return this.publisher.publish({post, stateHandler, publishMode, mediaMode, editHandler})
  }
}
