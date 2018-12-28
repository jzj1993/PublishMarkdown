
---

# 注释：文件开头使用YAML语法配置文章信息，之后是正常的Markdown语法

# 不配置标题则从Markdown或文件名提取
title: Sample


# 不配置摘要则从正文提取
abstract: 你好！这是一篇示例文档！


# URL用于固定链接、编辑文章功能，建议配置
url: sample


# 时间使用的时区和系统设置一致
date: 2015-07-30 18:35:43


category:
- Category1
- Category2


tags:
- Tag1
- Tag222
- Tag333333
- Tag4444444444
- Tag5


---


# 标题1

## 标题2

### 标题3

标题H1
====

标题H2
------


## 目录支持

[TOC]


## 基本功能


文本
换行

段落


特殊字体 **粗体** *斜体* ~~删除线~~ _下划线_


水平线

---


> 引用
>> 二级引用
>>> 三级引用

- 无序列表1
- 无序列表2

1. 有序列表1
2. 有序列表2

- 列表
    - 二级列表
        - 三级列表
            - 四级列表
    - 二级列表


## 图片与链接


### 网络图片

网络图片发布时不会自动上传

![网络图片](https://github.com/jzj1993/PublishMarkdown/raw/master/docs/sample-web-image.png)

### 本地图片

- 本地图片支持相对路径和绝对路径，发布时可自动上传。

- 之前已经**使用本工具上传**的图片，再次发布**相同博客站点**时，图片无需重复上传。图片根据文件内容(md5)区分。

![本地图](sample-image.png)


### 链接

点击外部链接，在系统浏览器中打开

测试 https://github.com 测试


## 表格支持

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3



## 代码与高亮

### 行内代码

行内代码`void testMain(int args)`测试


### 代码块

代码高亮由highlightjs渲染。发布时默认不进行高亮渲染，建议在博客中配置插件实现高亮。

```cpp
// C++
for (int i = 0; i < 100; i++)
{
    printf("hello markdown!\n");
}
```


### WordPress配置

对于WordPress博客，直接安装`WP Code Highlight.js`插件即可。


## 数学公式支持


- 公式由[MathJax](https://www.mathjax.org/)渲染，公式的识别规则和[Pandoc](http://pandoc.org/MANUAL.html#math)相同

- 发布时默认只对公式进行识别但不渲染，建议在博客中配置MathJax插件实现，InlineMath分隔符为`\(...\)`，DisplayMath分隔符为`\[...\]`。


### WordPress配置参考

安装`Simple Mathjax`插件，并设置`Custom mathjax config`参数如下即可。

```js
MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[','\\]']]
    }
})
```

> 如果配置后博客加载慢，可尝试设置`Custom mathjax CDN`参数为`https://cdn.bootcss.com/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML`


### 行内公式

行内公式在单个美元符号之间 $\frac{a}{b}$ 测试 $\frac{x}{123456789+123456789+123456789}$ 测试 $\delta = \beta / (\alpha + 1)$ 测试

- 如果美元符号紧跟数字，不会识别为行内公式 $20,000 and $30,000

- 如果起始美元符号紧跟空格，或终止美元符号前面是空格，也不会识别为公式 $ \frac{a}{b} $

- 行内代码不识别为公式 `$\frac{a}{b}$`



### 行间公式

行间公式在两个美元符号之间 $$ U_o = A^2 * ( U_+ - U_- ) $$

$$ \int_1 ^2 sin x dx $$

$$
\frac{O}{I}  \approx \frac{A}{1+AF}
$$

代码块不识别为公式

```
$$
\frac{a}{b}
$$
```

方程组1

$$
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
$$

方程组2

$$
\left\{
\begin{array}{ll}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y &=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{array}
\right.
$$

