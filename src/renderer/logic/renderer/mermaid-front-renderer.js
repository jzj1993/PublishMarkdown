/**
 * Mermaid front renderer. Render mermaid code into svg graph in browser enverionment.
 *
 * Created by jzj on 2020-04-05.
 */
'use strict'

const mermaid = require('mermaid')
const he = require('he')

mermaid.loadPreferences = (preferenceStore) => {
  let mermaidTheme = preferenceStore.get('mermaid-theme')
  if (mermaidTheme === undefined) {
    mermaidTheme = 'default'
  }
  let ganttAxisFormat = preferenceStore.get('gantt-axis-format')
  if (ganttAxisFormat === undefined) {
    ganttAxisFormat = '%Y-%m-%d'
  }
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme,
    gantt: {
      axisFormatter: [
        [ganttAxisFormat, (d) => {
          return d.getDay() === 1
        }]
      ]
    }
  })
  return {
    'mermaid-theme': mermaidTheme,
    'gantt-axis-format': ganttAxisFormat
  }
}

function renderElement(e) {
  let code = he.decode(e.innerHTML)
  e.innerHTML = mermaid.mermaidAPI.render('graphDiv', code)
}

export async function render(container, selector = '.mermaid') {
  const elements = container.querySelectorAll(selector)
  elements.forEach(renderElement)
}
