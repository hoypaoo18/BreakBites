import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {createRequire} from 'node:module'
const {createCanvas,DOMMatrix,ImageData,Path2D,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas')
globalThis.DOMMatrix=DOMMatrix
globalThis.ImageData=ImageData
globalThis.Path2D=Path2D
console.log('Canvas loaded')
const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs')
console.log('Reader loaded')
let doc
try { doc=await pdfjs.getDocument({data:new Uint8Array(readFileSync('C:/Users/Jerard Verroya/Downloads/Group_3_Wireshark.pptx.pdf')),useSystemFonts:true}).promise } catch(err) { console.log('PDF error',String(err));process.exit(1) }
mkdirSync('tmp/reference-pages',{recursive:true})
const sheet=createCanvas(1200,Math.ceil(doc.numPages/2)*350),ctx=sheet.getContext('2d')
ctx.fillStyle='#e7e7e7';ctx.fillRect(0,0,sheet.width,sheet.height)
for(let index=1;index<=doc.numPages;index++){
  const page=await doc.getPage(index),viewport=page.getViewport({scale:800/page.getViewport({scale:1}).width})
  const canvas=createCanvas(viewport.width,viewport.height)
  await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise
  const bytes=canvas.toBuffer('image/png')
  writeFileSync(`tmp/reference-pages/page-${index}.png`,bytes)
  const image=await loadImage(bytes)
  const x=((index-1)%2)*600+10,y=Math.floor((index-1)/2)*350+25
  ctx.drawImage(image,x,y,580,326)
}
writeFileSync('tmp/reference-pages/contact-sheet.png',sheet.toBuffer('image/png'))
console.log(`Rendered ${doc.numPages} reference slides.`)
