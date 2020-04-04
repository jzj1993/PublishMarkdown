/**
 * 状态栏信息显示
 *
 * Created by jzj on 2018/12/16.
 */
'use strict'

let _text = undefined
let _callback = undefined
let _timeout = undefined

function set(text) {
  _text = text
  _callback && _callback(text)
}

export function show(text, duration = 2000) {
  if (_timeout) {
    clearTimeout(_timeout)
    _timeout = undefined
  }
  set(text)
  if (duration > 0) {
    _timeout = setTimeout(() => {
      _timeout = undefined
      set(undefined)
    }, duration)
  }
}

export function setCallback(callback) {
  _callback = callback
}
