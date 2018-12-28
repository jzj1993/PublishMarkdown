
---

# Note: The beginning of the file uses YAML syntax to configure the article information, followed by the normal Markdown syntax.


# Title will be extracted from Markdown or file name if not configured here.
title: Sample


# Abstract will be extracted from Markdown if not configured here.
abstract: Hello! This is a sample document!


# URL is used for permalink and article editing, and it is recommended to be configured.
url: sample


# Time zone used by time is  the same as the system settings.
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


# Heading 1

## Heading 2

### Heading 3

Heading 1
====

Heading 2
------


## Table Of Contents Support

[TOC]


## Basic Syntax


Text
Text

Paragraph


Special font **Bold** *Italic* ~~Strikethrough~~ _Underline_


Horizontal line

---


> Quote
>> Secondary quote
>>> Three-level quote

- Unordered list 1
- Unordered list 2

1. Ordered list 1
2. Ordered list 2

- List
    - Secondary list
        - Three-level list
            - Four-level list
    - Secondary list


## Images and Links


### Web Images

Web images are not automatically uploaded when they are published.

![Web Image](https://github.com/jzj1993/PublishMarkdown/raw/master/docs/sample-web-image.png)


### Local Images

- Local images support relative and absolute paths and are automatically uploaded when publish.

- Images that have been uploaded **using this tool before**, when publishing to the **same blog site** again, the images do not need to be uploaded repeatedly. Images are identified by its file content (md5).

![Local Image](sample-image.png)


### Links

Click on the external link to open it in the system browser.

Test https://github.com Test


## Table Support

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3



## Code and Highlighting

### Inline Code

Inline code `void testMain(int args)` test.

### Code Block

Code highlighting is rendered by highlightjs. It is not highlighted by default when publishing. It is recommended to configure plugin to highlight in the blog.

```cpp
// C++
for (int i = 0; i < 100; i++)
{
    printf("hello markdown!\n");
}
```


### WordPress Configuration

For WordPress blog, just install the `WP Code Highlight.js` plugin directly.


## MathJax formula support


- Formula is rendered by [MathJax](https://www.mathjax.org/). The recognition rules of the formula is the same as [Pandoc](http://pandoc.org/MANUAL.html#math).

- By default, formula is only recognized but not rendered when publishing. It is recommended to configure the MathJax plugin to render in the blog. Inline math delemiter is `\(...\)` and display math delemiter is `\[...\]`.


### WordPress Configuration

Install the `Simple Mathjax` plugin and set the `Custom mathjax config` parameters as follows.

```js
MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[','\\]']]
    }
})
```

> If the blog is loaded slowly after configuration, try setting the `Custom mathjax CDN` parameter to `https://cdn.bootcss.com/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML`


### Inline formula (Inline Math)

Inline formula is between single dollar signs. $\frac{a}{b}$ Test $\frac{x}{123456789+123456789+123456789}$ Test $\delta = \beta / (\alpha + 1)$ Test

- If the dollar sign is followed by a number, it will not be recognized as formula. $20,000 and $30,000.

- If the opening dollar sign have a space character immediately to its right, or the closing dollar sign have a space character immediately to its left, it will not be recognized as formula. $ \frac{a}{b} $

- Inline code will not be recognized as formula. `$\frac{a}{b}$`



### Interline formula (Display Math)

Interline formula is between two dollar signs. $$ U_o = A^2 * ( U_+ - U_- ) $$

$$ \int_1 ^2 sin x dx $$

$$
\frac{O}{I}  \approx \frac{A}{1+AF}
$$

Code block will not be recognized as formula.

```
$$
\frac{a}{b}
$$
```

Equation 1

$$
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
$$

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

