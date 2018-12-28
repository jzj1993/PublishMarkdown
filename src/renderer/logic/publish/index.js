/**
 *
 * Created by jzj on 2018/12/7.
 */
'use strict'

import {MetaWeblogPublisher} from './MetaWeblogPublisher'

export class PostPublisher {

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