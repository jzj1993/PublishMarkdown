# Publish Markdown

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/meituan/WMRouter/master/LICENSE)
[![Release Version](https://img.shields.io/badge/release-0.0.3-red.svg)](https://github.com/jzj1993/PublishMarkdown/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/jzj1993/PublishMarkdown/pulls)


## 简介 Introduction

Publish Markdown是一款将本地Markdown文件发布到博客的开源工具，基于Electron实现，支持中英文，兼容Windows、Linux、MacOS平台。

1. 支持主流Markdown语法、TOC、代码高亮、MathJax数学公式，支持本地预览和简易编辑功能（建议使用Haroopad、Typora等工具编写好后，再使用本工具发布）。
1. 全自动博客发布。博客可设置标题、摘要、固定链接、作者、发布时间、标签、分类等属性，自动批量上传markdown文件中引用的本地图片。支持多站点同时发布。目前支持MetaWeblog接口，兼容WordPress、csdn、cnblogs、oschina等博客，后续可以继续开发其他接口。
1. 已经通过本工具发布到远程的博客，可以使用本工具更新(博客使用固定链接即url区分)，且更新时相同图片无需重复上传(图片使用文件md5区分)。


Publish Markdown is an open source tool for publishing local markdown files to blogs, based on electron, supporting Chinese and English, compatible with Windows, Linux, and MacOS platforms.

1. Support mainstream Markdown syntax, TOC, code highlighting, MathJax formula. Provide local preview and simple Markdown editing functions (It is recommended to use Haroopad, Typora and other tools to write and use this tool to publish).
1. Full automatically blog posting. Many meta data can be set for blogs, including title, abstract, permalink, create time, tags, categories, etc. Local images in blog will be automatically uploaded. Publishing to multiple sites simultaneously is also supported. Currently support MetaWeblog interface, compatiable with WordPress, csdn, cnblogs, oschina, etc.
1. Blogs which already be published with this tools can be updated (blogs are identified by permalink), and the same image will be reused other than uploading repeatedly when editing the blog (images are identified by file md5).


## 使用说明 Usage

[下载](https://github.com/jzj1993/PublishMarkdown/releases)安装后，详见欢迎页说明。

After [download](https://github.com/jzj1993/PublishMarkdown/releases) and install, please see the welcome page for details.


## 相关文章 Related Articles

[PublishMarkdown：本地Markdown文件发布到博客的开源工具](http://www.paincker.com/publish-markdown)

[WordPress+Markdown+为知笔记，实现高质量笔记和博客](http://www.paincker.com/wp-markdown-wiz-blog)


## 更新日志 ChangeLog

[更新日志](docs/CHANGELOG.md)

[ChangeLog](docs/CHANGELOG.md)


## 参与完善本工具 Contributing

欢迎提交[PullRequest](https://github.com/jzj1993/PublishMarkdown/pulls)和Star。

有任何疑问和建议，可在GitHub创建[Issue](https://github.com/jzj1993/PublishMarkdown/issues)。如出现故障，可在菜单 - 显示 - 切换开发者工具中打开调试窗口，将Console中的错误信息一并提交到Issue。

[Pull requests](https://github.com/jzj1993/PublishMarkdown/pulls) and stars are always welcome.

For bugs and feature requests, please create an [issue](https://github.com/jzj1993/PublishMarkdown/issues). If any error occured, you can click menu View - Toggle Developer Tools to open the debug window, and submit the error message from the console in your issue.


工程基于[electron-vue](https://github.com/SimulatedGREG/electron-vue)搭建。环境配置：

This project is build on [electron-vue](https://github.com/SimulatedGREG/electron-vue). Setting up the environment:

```bash
git clone git@github.com:jzj1993/PublishMarkdown.git
cd PublishMarkdown
yarn
yarn dev
```


## 屏幕截图 Screenshots

![](docs/screenshot-1.png)
![](docs/screenshot-2.png)
![](docs/screenshot-3.png)
![](docs/screenshot-4.png)
![](docs/screenshot-5.png)
![](docs/screenshot-6.png)
![](docs/screenshot-7.png)
