---
title: index.ts
nav_order: 1
parent: 模块
---

# 概述

Stream 常用函数

---

<h2 class="text-delta">目录</h2>

- [isStream (函数)](#isstream-%E5%87%BD%E6%95%B0)
- [readChunkFromStream (函数)](#readchunkfromstream-%E5%87%BD%E6%95%B0)
- [streamSize (函数)](#streamsize-%E5%87%BD%E6%95%B0)
- [streamToBuffer (函数)](#streamtobuffer-%E5%87%BD%E6%95%B0)
- [streamToString (函数)](#streamtostring-%E5%87%BD%E6%95%B0)

---

# isStream (函数)

是否输入为`Stream`

**签名**

```ts

export const isStream =
    (a: unknown): a is Stream => ...

```

v0.2.0 中添加

# readChunkFromStream (函数)

从流的开始位置读取给定的长度的内容块
如果 peek 为真,数据将放回到流中。

**签名**

```ts

export const readChunkFromStream = ({ size, peek }: { size: number, peek?: boolean }) => (stream: Readable): Task<Buffer> => ...

```

v0.2.0 中添加

# streamSize (函数)

获得流的长度

v0.2.0 中添加

# streamToBuffer (函数)

读取流到 Buffer

v0.2.0 中添加

# streamToString (函数)

把流转换为文本

**签名**

```ts

export const streamToString = ({ encoding = 'utf8' }: { encoding?: string }) => (stream: Stream): Task<string> => ...

```

v0.2.0 中添加
