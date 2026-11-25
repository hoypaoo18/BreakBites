import {readFileSync,writeFileSync} from 'node:fs'
import {inflateSync} from 'node:zlib'
const file=readFileSync('C:/Users/Jerard Verroya/Downloads/Group_3_Wireshark.pptx.pdf')
const source=file.toString('latin1')
const streams=[]
for(const match of source.matchAll(/(\d+) \d+ obj([\s\S]*?)stream\r?\n/g)) {
  const start=match.index+match[0].length
  const length=match[2].match(/\/Length\s+(\d+)/)
  if(!length) continue
  let bytes=file.subarray(start,start+Number(length[1]))
  try {if(match[2].includes('/FlateDecode')) bytes=inflateSync(bytes)} catch {continue}
  if(!match[2].includes('/Subtype /Image')) streams.push({id:match[1],header:match[2],text:bytes.toString('latin1')})
}
writeFileSync('tmp/pdf-streams.json',JSON.stringify(streams,null,2))
console.log(source.match(/\/Count \d+/g))
console.log(streams.map(s=>({id:s.id,header:s.header.slice(0,100),text:s.text.slice(0,140)})))
