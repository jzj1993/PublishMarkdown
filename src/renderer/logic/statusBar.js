/**
 * Created by jzj on 2018/12/16.
 */
'use strict'

let _text = null
let _callback = null
let _handle = null

function set(text) {
  _text = text
  _callback && _callback(text)
}

export function show(text, duration = 2000) {
  if (_handle) {
    clearTimeout(_handle)
    _handle = null
  }
  set(text)
  if (duration > 0) {
    _handle = setTimeout(() => {
      _handle = null
      set(null)
    }, duration)
  }
}

export function handle(callback) {
  _callback = callback
}
