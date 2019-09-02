---
title: index.ts
nav_order: 1
parent: Modules
---

# Overview

Common function for Stream

---

<h2 class="text-delta">Table of contents</h2>

- [isStream (function)](#isstream-function)
- [readChunkFromStream (function)](#readchunkfromstream-function)
- [streamSize (function)](#streamsize-function)
- [streamToBuffer (function)](#streamtobuffer-function)
- [streamToString (function)](#streamtostring-function)

---

# isStream (function)

Determines whether the passed value is a `Stream`.

**Signature**

```ts

export const isStream =
    (a: unknown): a is Stream => ...

```

Added in v0.2.0

# readChunkFromStream (function)

Reads a certain amount of bytes from the beginning of a Stream, returning a Buffer.
The amount of data read might be smaller if the stream ends before it could return the amount of data requested.

If the `peek` argument is true, the data is put back into the beginning of the stream, so it can be consumed by another function

Note that this function will pause the stream, so you might need to call the `resume` method on it to make it flow again.

If passing a stream that has already ended, the function could enter into an infinite loop and return a Promise that never resolves. It's your responsibility to ensure that streams passed to this function still have data to return.

**Signature**

```ts

export const readChunkFromStream = ({ size, peek }: { size: number, peek?: boolean }) => (stream: Readable): Task<Buffer> => ...

```

Added in v0.2.0

# streamSize (function)

Returns stream's size

Added in v0.2.0

# streamToBuffer (function)

Returns a Buffer with data read from the stream.

Added in v0.2.0

# streamToString (function)

Returns a string with data read from the stream.

**Signature**

```ts

export const streamToString = ({ encoding = 'utf8' }: { encoding?: string }) => (stream: Stream): Task<string> => ...

```

Added in v0.2.0
