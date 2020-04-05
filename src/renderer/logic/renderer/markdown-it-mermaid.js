/**
 * mermaid preprocess
 *
 * markdown ==> html for mermaid
 *
 * ```mermaid ... ```  ==>  <div class="mermaid">...</div>
 *
 * Reference:
 *   https://github.com/mermaid-js/mermaid
 *   https://github.com/tylingsoft/markdown-it-mermaid
 */
'use strict'

const mermaid = require('mermaid')

const mermaidChart = (code) => {
  try {
    mermaid.parse(code)
    return `<div class="mermaid">${code}</div>`
  } catch ({str, hash}) {
    return `<pre>${str}</pre>`
  }
}

module.exports = (md) => {
  md.mermaid = mermaid
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    // const firstLine = code.split(/\n/)[0].trim()
    // if (firstLine.match(/^((graph (TB|BT|RL|LR|TD);?)|sequenceDiagram|gantt|classDiagram|stateDiagram|pie)$/)) {
    //   return mermaidChart(code)
    // }
    return temp(tokens, idx, options, env, slf)
  }
}
