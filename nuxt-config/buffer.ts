export default defineNuxtPlugin(() => {
  import('buffer/').then((Buffer) => {
    window.Buffer = (window.Buffer || Buffer.default.Buffer) as BufferConstructor
    globalThis.Buffer = (window.Buffer || Buffer.default.Buffer) as BufferConstructor
  })
})

