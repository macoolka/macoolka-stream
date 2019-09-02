import * as fs from 'fs'
import { join } from 'path'
import { streamToBuffer, streamToString, readChunkFromStream, streamSize,isStream } from '../'
const filepath = join(__dirname, 'fixtures',  'pg1008.txt')
const buffer = fs.readFileSync(filepath)
const getStream = () => fs.createReadStream(filepath)
import * as steam from 'stream'

describe('StreamUtils', function () {

    it('streamSize', async () => {
        const out = await streamSize(getStream())();
        expect(out).toEqual(fs.statSync(filepath).size)
        try{
            await streamSize('' as any)()
        }
        catch(error){
            expect(error).toMatchSnapshot()
        }
       
    })
    it('StreamToBuffer should convert a stream to Buffer', async () => {
        // Convert stream to buffer
        const out = await streamToBuffer(getStream())();
        expect(Buffer.isBuffer(out)).toBeTruthy()
        expect(buffer.equals(out)).toBeTruthy()
        try{
            await streamToBuffer('' as any)()
        }
        catch(error){
            expect(error).toMatchSnapshot()
        }
    })
    it('isStream', () => {
        expect(isStream(fs.createWriteStream('abc.ts'))).toEqual(true)
        expect(isStream(new steam.Writable())).toEqual(true)
        expect(isStream(new steam.Readable())).toEqual(true)
        expect(isStream(new steam.Duplex())).toEqual(true)
        expect(isStream('')).toEqual(false)

    })
    it('StreamToString should convert a stream to string', async () => {

        const result = await streamToString({})(getStream())()
        expect(typeof result == 'string').toBeTruthy()
        expect(result == buffer.toString('utf8')).toBeTruthy()
        const result1 = await streamToString({ encoding: 'base64' })(getStream())()
        expect(typeof result1 == 'string').toBeTruthy()
        expect(result1 == buffer.toString('base64')).toBeTruthy()

    })

    it('ReadChunkFromStream should extract the first N bytes from a stream', async ()=> {


        // Test with a stream that will be used more than once, to ensure that data is put back in the stream
        const reusableStream = getStream()

        // Function that tests for output
        const testOutput = (size: number) => {
            return (out: Buffer) => {
                expect(out.byteLength == size)
                expect(out.equals(buffer.slice(0, size)))
            }
        }
        try{
            await readChunkFromStream({ size: 100 })('' as any)()
        }
        catch(error){
            expect(error).toMatchSnapshot()
        }
        // Run multiple tests
        return Promise.all([
            // 100 bytes

            Promise.resolve()
                .then(() => {

                    return readChunkFromStream({ size: 100 })(getStream())()
                })
                .then(testOutput(100)),
            // 1000 bytes
            Promise.resolve()
                .then(() => {
                    return readChunkFromStream({ size: 1000 })(getStream())()

                })
                .then(testOutput(1000)),
            // Longer than buffer
            Promise.resolve()
                .then(() => {
                    return readChunkFromStream({ size: buffer.byteLength + 100 })(getStream())()
                    //  return StreamUtils.ReadChunkFromStream(getStream(), buffer.byteLength + 100)()
                })
                .then(testOutput(buffer.byteLength)),
            // Peeking stream - part 1
            Promise.resolve()
                .then(() => readChunkFromStream({ size: 100, peek: true })(reusableStream)())
                .then(testOutput(100)),
            // Peeking stream - part 2
            Promise.resolve()
                .then(() => readChunkFromStream({ size: 200, peek: true })(reusableStream)())
                .then(testOutput(200)),
            // Peeking stream - part 3
            Promise.resolve()
                .then(() => readChunkFromStream({ size: buffer.byteLength + 100, peek: true })(reusableStream)())

                .then(testOutput(buffer.byteLength)),
            // Peeking stream - part 4
            Promise.resolve()
                .then(() => readChunkFromStream({ size: buffer.byteLength + 100, peek: true })(reusableStream)())
                .then(testOutput(buffer.byteLength))
        ])
    })


})
