/**
 * Common function for Stream
 * @desczh
 * Stream 常用函数
 * @file
 */
import { Readable, Stream } from 'stream'
import { Task, task } from 'fp-ts/lib/Task'

/**
 * Returns a Buffer with data read from the stream.
 * @desczh
 * 读取流到Buffer
 * @since 0.2.0
 */
export function streamToBuffer(stream: Stream): Task<Buffer> {
    return () => new Promise((resolve, reject) => {
        const buffersCache: Array<Buffer> = []
        stream.on('data', (data: Buffer) => {

            buffersCache.push(data)
        })
        stream.on('end', () => {
            resolve(Buffer.concat(buffersCache))
        })
        stream.on('error', (error) => {
            reject(error)
        })

    })
}

/**
 * Determines whether the passed value is a `Stream`.
 * @desczh
 * 是否输入为`Stream`
 * @since 0.2.0
 */
export const isStream =
    (a: unknown): a is Stream => {
        return a instanceof Stream
    }
/**
 * Returns stream's size
 * @desczh
 * 获得流的长度
 * @since 0.2.0
 */
export function streamSize(stream: Stream): Task<number> {
    return () => new Promise((resolve, reject) => {
        let result = 0
        stream.on('data', (data: Buffer) => {
            result += data.byteLength
            //   buffersCache.push(data)
        })
        stream.on('end', () => {
            resolve(result)
        })
        stream.on('error', (error) => {
            reject(error)
        })

    })
}
/**
 * Returns a string with data read from the stream.
 * @desczh
 * 把流转换为文本
 * @since 0.2.0
 */

export const streamToString = ({ encoding = 'utf8' }: { encoding?: string }) => (stream: Stream): Task<string> => {
    return task.map(streamToBuffer(stream), ((buffer) => {
        return buffer.toString(encoding)
    }))
}

/**
 * Reads a certain amount of bytes from the beginning of a Stream, returning a Buffer.
 * The amount of data read might be smaller if the stream ends before it could return the amount of data requested.
 *
 * If the `peek` argument is true, the data is put back into the beginning of the stream, so it can be consumed by another function
 *
 * Note that this function will pause the stream, so you might need to call the `resume` method on it to make it flow again.
 *
 * If passing a stream that has already ended, the function could enter into an infinite loop and return a Promise that never resolves. It's your responsibility to ensure that streams passed to this function still have data to return.
 *
 * @desczh
 * 从流的开始位置读取给定的长度的内容块
 * 如果peek为真,数据将放回到流中。
 *
 * @since 0.2.0
 */
export const readChunkFromStream = ({ size, peek }: { size: number, peek?: boolean }) => (stream: Readable): Task<Buffer> => {

    // Ensure the stream isn't flowing
    stream.pause()

    // Returns a promise that resolves when we have read enough data from the stream.
    return () => new Promise((resolve, reject) => {
        // Callbacks on events
        const errorEvent = (err: Error) => {
            reject(err)
        }
        const readableEvent = () => {
            // If we don't have enough data, and the stream hasn't ended, this will return null
            const data = stream.read(size)
            if (data) {
                if (peek === true) {
                    // Put the data we read back into the stream
                    stream.unshift(data)
                }

                // Stop listening on callbacks
                stream.removeListener('error', errorEvent)

                // Return the data
                resolve(data)
            } else {
                // We need to wait longer for more data
                stream.once('readable', readableEvent)
            }
        }

        // Listen to the readable event and in case of error
        stream.once('readable', readableEvent)
        stream.on('error', errorEvent)
    })
}
