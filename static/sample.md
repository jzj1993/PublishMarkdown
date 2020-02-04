
---

# 注释：文件开头使用YAML语法配置文章信息，之后是正常的Markdown语法
# Note: The beginning of the file uses YAML syntax to configure the blog meta data, followed by the normal Markdown syntax.

# 此处如果不配置标题，则提取Markdown中的一级标题，或使用文件名
# Title will be extracted from heading 1 of markdown or using file name if not configured here.
title: 示例标题


# 此处如果不配置摘要，则从正文提取开头若干文字
# Abstract will be extracted from the begining of markdown content if not configured here.
abstract: 你好！这是一篇示例文档！


# URL用于固定链接、编辑文章功能，建议所有文章都配置
# URL is used for permalink and article editing, and it is recommended to be configured.
url: sample-docs-1


# 文章发布时间，使用的时区和系统设置一致，不设置则使用当前时间
# Article post time, time zone is the same as the system settings. Current time will be used if not configured here.
date: 2020-02-01 18:35:43


# 文章分类
category:
- Category1
- Category2


# 文章标签
tags:
- Tag1
- Tag222
- Tag333333
- Tag4444444444
- Tag5


---


# 标题1 Heading 1

## 标题2 Heading 2

### 标题3 Heading 3

标题H1 Heading H1
====

标题H2 Heading H2
------


## 目录 Table Of Contents

[TOC]


## 基本语法 Basic Syntax


文本 Text
换行 LineBreak

段落 Paragraph


特殊字体 **粗体** *斜体* ~~删除线~~ _下划线_
Special font **Bold** *Italic* ~~Strikethrough~~ _Underline_


水平线
Horizontal line

---


> 引用 Quote
>> 二级引用 Secondary Quote
>>> 三级引用 Three-level quote

- 无序列表1 Unordered list 1
- 无序列表2 Unordered list 2

1. 有序列表1 Ordered list 1
2. 有序列表2 Ordered list 2

- 列表 List
    - 二级列表 Secondary list
        - 三级列表 Three-level list
            - 四级列表 Four-level list
    - 二级列表 Secondary list


## 图片与链接 Images and Links


### 网络图片 Web Images

网络图片在发布时不会自动上传。

Web images will not be uploaded when publish.

![网络图片](https://github.com/jzj1993/PublishMarkdown/raw/master/docs/sample-web-image.png)


### 本地图片 Local Images

- 本地图片支持相对路径和绝对路径，在发布时会自动上传。

- 之前已经**使用本工具上传**的图片，再次发布**相同博客站点**时，图片无需重复上传。图片根据文件内容(md5)区分。

- Local images support relative and absolute paths, and will be automatically uploaded when publish.

- Images that have been uploaded **using this tool before**, when publishing to the **same blog site** again, the images do not need to be uploaded repeatedly. Images are identified by its file content (md5).


![本地图](sample-image.png)


### 链接 Links

点击外部链接，在系统浏览器中打开。

Click on the external link to open it in the system browser.

测试 https://github.com 测试

Test https://github.com Test


## 表格 Table

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3



## 代码高亮 Code Highlighting

### 行内代码 Inline Code

行内代码`void testMain(int args)`测试。

Inline code `void testMain(int args)` test.


### 代码块 Code Block

代码高亮由highlightjs渲染。发布时默认不进行高亮渲染，建议在博客站点中配置插件实现高亮。

Code highlighting is rendered by highlightjs. It is not highlighted by default when publishing. It is recommended to configure plugin to highlight in your blog site.

```cpp
// C++
for (int i = 0; i < 100; i++)
{
    printf("hello markdown!\n");
}
```


### WordPress配置 WordPress Configuration

对于WordPress博客，直接安装`WP Code Highlight.js`插件即可。

For WordPress blog, just install the `WP Code Highlight.js` plugin directly.


## 数学公式 MathJax formula


- 公式由[MathJax](https://www.mathjax.org/)渲染，公式的识别规则和[Pandoc](http://pandoc.org/MANUAL.html#math)相同

- 发布时默认只对公式进行识别但不渲染，建议在博客站点中配置MathJax插件实现，InlineMath分隔符为`\(...\)`，DisplayMath分隔符为`\[...\]`。


- Formula is rendered by [MathJax](https://www.mathjax.org/). The recognition rules of the formula is the same as [Pandoc](http://pandoc.org/MANUAL.html#math).

- By default, formula is only recognized but not rendered when publishing. It is recommended to configure the MathJax plugin to render in your blog site. Inline math delemiter is `\(...\)` and display math delemiter is `\[...\]`.


### WordPress配置 WordPress Configuration

安装`Simple Mathjax`插件，并设置`Custom mathjax config`参数如下即可。

Install the `Simple Mathjax` plugin and set the `Custom mathjax config` parameters as follows.

```js
MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[','\\]']]
    }
})
```

> 如果配置后博客加载慢，可尝试设置`Custom mathjax CDN`参数为`https://cdn.bootcss.com/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML`

> If the blog is loaded slowly after configuration, try setting the `Custom mathjax CDN` parameter to `https://cdn.bootcss.com/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML`


### 行内公式 Inline formula (Inline Math)

行内公式在单个美元符号之间 $\frac{a}{b}$ 测试 $\frac{x}{123456789+123456789+123456789}$ 测试 $\delta = \beta / (\alpha + 1)$ 测试

- 如果美元符号紧跟数字，不会识别为行内公式 $20,000 and $30,000

- 如果起始美元符号紧跟空格，或终止美元符号前面是空格，也不会识别为公式 $ \frac{a}{b} $

- 行内代码不识别为公式 `$\frac{a}{b}$`


Inline formula is between single dollar signs. $\frac{a}{b}$ Test $\frac{x}{123456789+123456789+123456789}$ Test $\delta = \beta / (\alpha + 1)$ Test

- If the dollar sign is followed by a number, it will not be recognized as formula. $20,000 and $30,000.

- If the opening dollar sign have a space character immediately to its right, or the closing dollar sign have a space character immediately to its left, it will not be recognized as formula. $ \frac{a}{b} $

- Inline code will not be recognized as formula. `$\frac{a}{b}$`



### 行间公式 Interline formula (Display Math)

行间公式在两个美元符号之间。Interline formula is between two dollar signs. $$ U_o = A^2 * ( U_+ - U_- ) $$

$$ \int_1 ^2 sin x dx $$

$$
\frac{O}{I}  \approx \frac{A}{1+AF}
$$

代码块不识别为公式。

Code block will not be recognized as formula.

```
$$
\frac{a}{b}
$$
```

方程组1
Equation 1

$$
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
$$

方程组2
Equation 2

$$
\left\{
\begin{array}{ll}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y &=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{array}
\right.
$$

