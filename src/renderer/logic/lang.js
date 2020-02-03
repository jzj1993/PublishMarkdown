/**
 * 多语言支持
 *
 * Created by jzj on 2018/10/3.
 */
'use strict'

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {getLanguage} from './config'


const en = {
  welcome: 'Welcome',
  settings: 'Settings',

  closeModifiedFile: 'File has been modified, confirm to close?',
  cannotWriteSampleFile: 'Cannot write sample file',
  readFileNotExists: 'File not exists: ',
  saveFileSuccess: 'File saved',
  saveFileError: 'Save file error ',
  readFileError: 'Read file error  ',

  publishSuccess: 'Publish Success',
  publishError: 'Publish Failed',

  setting: {
    siteSettings: 'Blog Settings',

    siteSettingsNote: 'Currently compatible with MetaWeblog interface blogs. Take WordPress as an example, URL is generally this form: "http://www.example.com/xmlrpc.php"',

    apiType: 'API Type',
    name: 'Name',
    url: 'URL',
    username: 'UserName',
    password: 'Password',
    addSite: 'Add Site',

    otherSettings: 'Other Settings',
    reset: 'Reset All Settings',
    resetConfirm: 'Confirm to reset all settings ?',

    renderSettings: 'Render Settings',
    highlight: 'Code Highlight',
    previewOnly: 'Preview Only',
    previewAndPublish: 'Preview and Publish',
    disable: 'Disable',
    mathjax: 'MathJax Formula',
    renderSettingsNote: '[Default] Preview Only：Render only when previewing locally, only pre-processing when publishing, blogs need to configure plugin to render<br/>' +
      'Preview and publish: Render when local preview and publish, blog needs to configure the corresponding CSS style<br/>' +
      'Disable: Not render when local preview and publish'
  },

  meta: {
    abstract: 'Abstract',
    file: 'File',
    url: 'Url',
    time: 'Time',
    categories: 'Categories',
    tags: 'Tags',
    empty: '(Not Specified)',
  },

  publish: {
    title: 'Publish To Blog',
    selectSites: 'Select Sites To Publish',
    settings: 'Settings',
    publishMode: 'Publish Mode',
    publishModeManual: 'Manual Confirm',
    publishModeCreate: 'Create New Article',
    publishModeAuto: 'Auto',
    publishModeHint: 'Create a new article or edit an existing article when a published article with the same URL detected.',
    publishModeConfirm: 'Confirm Publish Mode',
    publishModeOldPost: 'The article with the same URL is detected as follows:',
    publishModeEditPost: 'Edit this article',
    publishModeCreatePost: 'Create a new article',
    publish: 'Publish',
    publishing: 'Publishing...',

    confirmUrlTitle: 'Confirm blog information',
    confirmUrlMessage: 'The blog does not have a URL configured. It cannot be edited later using this tool. Do you want to continue publishing? You can open the sample document from the menu to see how the URL is configured.',
    confirmUrlContinue: 'Continue to publish',
    confirmUrlOpenSample: 'View sample document',
    confirmUrlCancel: 'Cancel publish',
  },

  introduction:
    '<h2>Introduction</h2>' +
    '<p>Publish Markdown is an open source tool for publishing local Markdown files to blogs, based on Electron, supporting Chinese and English, compatible with Windows, Linux, and MacOS platforms.</p>' +
    '<ol>' +
    '<li>Support mainstream Markdown syntax, TOC, code highlighting, MathJax formula. Provide local preview and simple Markdown editing functions (It is recommended to use Haroopad, Typora and other tools to write and use this tool to publish).</li>' +
    '<li>Full automatically blog posting. Many meta data can be set for blogs, including title, abstract, permalink, create time, tags, categories, etc. Local images in blog will be automatically uploaded. Publishing to multiple sites simultaneously is also supported. Currently support MetaWeblog interface, compatiable with WordPress, csdn, cnblogs, oschina, etc.</li>' +
    '<li>Blogs which already be published with this tools can be updated (blogs are identified by permalink), and the same image will be reused other than uploading repeatedly when editing the blog (images are identified by file md5).</li>' +
    '</ol>' +
    '<h2>Usage</h2>' +
    '<ol>' +
    '<li>Open <a href="#" data-href="settings">settings</a> from menu, configure the blog URL and account information.</li>' +
    '<li>Open the Markdown file to be published from menu and see if the rendering result is correct. Note that the markdown source file must be UTF-8 encoded with extension <code>.md</code>.</li>' +
    '<li>Click publish from menu, select the blog sites that needs to be published to, click "Publish". Local previews use GitHub styles, and when published to a blog, the final effect depends on the CSS style configuration of the blog.</li>' +
    '<li>For articles <b>published using this tool</b>, when you publish to the <b>same site</b> again using the <b>same URL</b>, you can choose to edit existing articles or create new ones at the time of publishing.</li>' +
    '<li>If you have questions about the format of your document, you can open the <a href="#" data-href="sample">sample markdown file</a> at any time.</li>' +
    '<li>For more infomation, please visit <a href="https://github.com/jzj1993/PublishMarkdown">GitHub</a>, <a href="http://paincker.com/publish-markdown">Tech Blog</a>.</li>' +
    '</ol>',
}

const zh = {
  welcome: '欢迎',
  settings: '设置',

  closeModifiedFile: '文件已修改，确认关闭？',
  cannotWriteSampleFile: '示例文件不可修改',
  readFileNotExists: '文件不存在：',
  saveFileSuccess: '文件已保存',
  saveFileError: '文件保存失败 ',
  readFileError: '文件读取失败 ',

  publishSuccess: '发布成功',
  publishError: '发布失败',

  setting: {
    siteSettings: '博客站点设置',
    siteSettingsNote: '目前兼容MetaWeblog接口的博客。以WordPress为例，URL一般是这种形式 "http://www.example.com/xmlrpc.php"',

    apiType: 'API类型',
    name: '名称',
    url: 'URL',
    username: '用户名',
    password: '密码',
    addSite: '添加站点',

    otherSettings: '其他设置',
    reset: '重置全部设置',
    resetConfirm: '确认重置全部设置为默认值？',

    renderSettings: '渲染设置',
    highlight: '代码高亮',
    previewOnly: '仅预览',
    previewAndPublish: '预览和发布',
    disable: '禁用',
    mathjax: 'MathJax公式',
    renderSettingsNote: '[默认] 仅预览：只在本地预览时渲染，发布时只做预处理，博客配置插件渲染<br/>' +
      '预览和发布：本地预览、发布时都渲染，博客需要配置相应的CSS样式<br/>' +
      '不使用：本地预览、发布时都不渲染',
  },

  meta: {
    abstract: '摘要',
    file: '文件',
    url: '链接',
    time: '时间',
    categories: '分类',
    tags: '标签',
    empty: '(无)',
  },

  publish: {
    title: '发布到博客',
    selectSites: '选择要发布到的博客',
    settings: '博客配置',
    publishMode: '发布模式',
    publishModeManual: '手动确认',
    publishModeCreate: '创建新文章',
    publishModeAuto: '自动判断',
    publishModeHint: '检测到已发布过的URL相同的文章时，创建新文章还是编辑已有文章',
    publishModeConfirm: '发布模式确认',
    publishModeOldPost: '检测到URL相同的文章如下：',
    publishModeEditPost: '编辑此文章',
    publishModeCreatePost: '创建新文章',
    publish: '发布',
    publishing: '发布中...',

    confirmUrlTitle: '确认博客信息',
    confirmUrlMessage: '博客没有配置URL，后续无法使用本工具编辑，是否继续发布？你可以从菜单打开示例文档，查看URL的配置方法。',
    confirmUrlContinue: '继续发布',
    confirmUrlOpenSample: '查看示例文档',
    confirmUrlCancel: '取消发布',
  },

  introduction:
    '<h2>简介</h2>' +
    '<p>Publish Markdown是一款将本地Markdown文件发布到博客的开源工具，基于Electron实现，支持中英文，兼容Windows、Linux、MacOS平台。</p>' +
    '<ol>' +
    '<li>支持主流Markdown语法、TOC、代码高亮、MathJax数学公式，支持本地预览和简易编辑功能（建议使用Haroopad、Typora等工具编写好后，再使用本工具发布）。</li>' +
    '<li>全自动博客发布。博客可设置标题、摘要、固定链接、作者、发布时间、标签、分类等属性，自动批量上传markdown文件中引用的本地图片。支持多站点同时发布。目前支持MetaWeblog接口，兼容WordPress、csdn、cnblogs、oschina等博客，后续可以继续开发其他接口。</li>' +
    '<li>已经通过本工具发布到远程的博客，可以使用本工具更新(博客使用固定链接即url区分)，且更新时相同图片无需重复上传(图片使用文件md5区分)。</li>' +
    '</ol>' +
    '<h2>使用说明</h2>' +
    '<ol>' +
    '<li>从菜单打开<a href="#" data-href="settings">设置</a>，配置需要发布的博客网址和账户信息。</li>' +
    '<li>从菜单打开要发布的Markdown文件，查看渲染结果是否正确。注意Markdown源文件必须是UTF-8编码，扩展名为<code>.md</code>。</li>' +
    '<li>从菜单点击发布，弹窗勾选需要发布的博客，点击“发布”即可。本地预览使用的是GitHub风格的样式，发布到博客后，最终效果取决于博客的CSS样式配置。</li>' +
    '<li>对于<b>使用本工具发布过的文章</b>，使用<b>相同URL</b>再次发布到<b>相同站点</b>时，可以在发布时选择编辑已有文章还是创建新文章。</li>' +
    '<li>如果对文档编写格式存在疑问，可以随时打开<a href="#" data-href="sample">示例文档</a>查看。</li>' +
    '<li>更多内容请查看<a href="https://github.com/jzj1993/PublishMarkdown">GitHub</a>，<a href="http://paincker.com/publish-markdown">技术博客</a>。</li>' +
    '</ol>',
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: getLanguage(),
  fallbackLocale: 'en',
  messages: {
    en: en,
    zh: zh,
  },
})

export function setLanguage(vue, lang) {
  if (lang !== vue.$i18n.locale) {
    vue.$i18n.locale = lang
  }
}

export default i18n
