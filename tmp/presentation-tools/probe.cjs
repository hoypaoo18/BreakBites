console.log('Loading PDF renderer')
const {createCanvas,DOMMatrix,ImageData,Path2D}=require('@napi-rs/canvas')
Object.assign(globalThis,{DOMMatrix,ImageData,Path2D})
import('pdfjs-dist/legacy/build/pdf.mjs').then(pdf=>console.log('PDF reader ready',pdf.version)).catch(err=>console.log(String(err)))
