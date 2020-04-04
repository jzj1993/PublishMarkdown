/**
 * 菜单
 *
 * Created by jzj on 2018/12/16.
 */
'use strict'

import {Menu, app, dialog, shell} from 'electron'

const langConfig = require('../common/lang-config')
const language = require('./language')

export function init(mainWindow) {

  const webContents = mainWindow.webContents

  function setLanguage(lang) {
    langConfig.setLanguage(lang)
    webContents.send('menu.language', lang)
    init(mainWindow)
  }

  const lang = langConfig.getLanguage()
  const l = lang === 'zh' ? language.zh : language.en

  const template = [
    {
      label: l.file,
      submenu: [
        {
          label: l.open,
          accelerator: 'CmdOrCtrl+O',
          click: function () {
            dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{name: 'Markdown', extensions: ['md']}]
            }, filenames => {
              if (filenames && filenames.length > 0 && filenames[0]) {
                webContents.send('menu.open', filenames[0])
              }
            })
          },
        },
        {
          type: 'separator'
        },
        {
          label: l.save,
          accelerator: 'CmdOrCtrl+S',
          click: function () {
            webContents.send('menu.save')
          },
        },
        {
          label: l.publish,
          accelerator: 'CmdOrCtrl+P',
          click: function () {
            webContents.send('menu.publish')
          },
        },
        {
          type: 'separator'
        },
        {
          label: l.settings,
          click: function () {
            webContents.send('menu.settings')
          }
        },
        {
          label: l.language,
          submenu: [
            {
              label: '简体中文',
              type: 'checkbox',
              checked: lang === 'zh',
              click: function () {
                setLanguage('zh')
              }
            },
            {
              label: 'English',
              type: 'checkbox',
              checked: lang === 'en',
              click: function () {
                setLanguage('en')
              }
            }
          ]
        },
      ]
    },
    {
      label: l.edit,
      submenu: [
        {
          label: l.undo,
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: l.redo,
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: l.cut,
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: l.copy,
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: l.paste,
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: l.selectAll,
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    },
    {
      label: l.view,
      submenu: [
        {
          label: l.toggleFullScreen,
          accelerator: (function () {
            if (process.platform === 'darwin')
              return 'Ctrl+Command+F'
            else
              return 'F11'
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        },
        {
          label: l.reload,
          // accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload()
          }
        },
        {
          label: l.toggleDevTools,
          // accelerator: (function () {
          //   if (process.platform === 'darwin')
          //     return 'Alt+Command+I'
          //   else
          //     return 'Ctrl+Shift+I'
          // })(),
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools()
          }
        },
      ]
    },
    {
      label: l.window,
      role: 'window',
      submenu: [
        {
          label: l.minimize,
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: l.close,
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: l.help,
      role: 'help',
      submenu: [
        {
          label: l.openWelcomePage,
          click: function () {
            webContents.send('menu.welcome')
          }
        },
        {
          label: l.viewSampleFile,
          click: function () {
            webContents.send('menu.sample')
          }
        },
        {
          label: l.learnMore,
          click: function () {
            app.getAppPath()
            shell.openExternal('https://github.com/jzj1993/PublishMarkdown')
          }
        },
      ]
    },
  ]

  if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: l.about + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: l.services,
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: l.hide + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: l.hideOthers,
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: l.showAll,
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: l.quit,
          accelerator: 'Command+Q',
          click: function () {
            app.quit()
          }
        },
      ]
    })
    const windowMenu = template.find(function (m) {
      return m.role === 'window'
    })
    if (windowMenu) {
      windowMenu.submenu.push(
        {
          type: 'separator'
        },
        {
          label: l.bringAllToFront,
          role: 'front'
        }
      )
    }
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
