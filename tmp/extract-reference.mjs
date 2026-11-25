import {readFileSync,writeFileSync} from 'node:fs'
import {inflateSync} from 'node:zlib'
const file=readFileSync('C:/Users/Jerard Verroya/Downloads/Group_3_Wireshark.pptx.pdf')
const source=file.toString('latin1')
const objects=new Map()
for(const match of source.matchAll(/(\d+) \d+ obj\s*([\s\S]*?)endobj/g)) objects.set(Number(match[1]),match[2])
function stream(id) {
  const obj=objects.get(id)||''
  const match=obj.match(/stream\r?\n/)
  if(!match) return ''
  const bytes=Buffer.from(obj.slice(match.index+match[0].length,match.index+match[0].length+Number(obj.match(/\/Length\s+(\d+)/)?.[1]||0)),'latin1')
  try{return (obj.includes('/FlateDecode')?inflateSync(bytes):bytes).toString('latin1')}catch{return ''}
}
function cmap(id) {
  const text=stream(id),map=new Map()
  for(const block of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) for(const m of block[1].matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]+)>/gi)) map.set(parseInt(m[1],16),String.fromCodePoint(parseInt(m[2],16)))
  for(const block of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) for(const m of block[1].matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]+)>\s*<([0-9a-f]+)>/gi)) for(let n=parseInt(m[1],16);n<=parseInt(m[2],16);n++)map.set(n,String.fromCodePoint(parseInt(m[3],16)+n-parseInt(m[1],16)))
  for(const block of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) for(const m of block[1].matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]+)>\s*\[([^\]]+)\]/gi)) {
    let n=parseInt(m[1],16)
    for(const item of m[3].matchAll(/<([0-9a-f]+)>/gi))map.set(n++,String.fromCodePoint(parseInt(item[1],16)))
  }
  return map
}
const result=[]
for(const [id,obj] of objects) {
  if(!/\/Type \/Page\s/.test(obj))continue
  const content=stream(Number(obj.match(/\/Contents (\d+) 0 R/)?.[1]))
  const resources=objects.get(Number(obj.match(/\/Resources (\d+) 0 R/)?.[1]))||obj
  const fontBlock=objects.get(Number(resources.match(/\/Font (\d+) 0 R/)?.[1]))||resources
  const fonts=new Map()
  for(const m of fontBlock.matchAll(/\/(F\d+) (\d+) 0 R/g)) {
    const font=objects.get(Number(m[2]))||''
    fonts.set(m[1],cmap(Number(font.match(/\/ToUnicode (\d+) 0 R/)?.[1])))
  }
  let current=''
  const lines=[]
  for(const m of content.matchAll(/\/(F\d+) [\d.]+ Tf|<([0-9a-f]+)>\s*Tj|\[([^\]]*)\]\s*TJ|\(((?:\\.|[^\\()])*)\)\s*Tj/gi)) {
    if(m[1])current=m[1]
    else {
      const literal=m[4]===undefined?null:m[4].replace(/\\([0-7]{1,3}|.)/g,(_,value)=>/^[0-7]+$/.test(value)?String.fromCharCode(parseInt(value,8)):({n:'\n',r:'\r',t:'\t',b:'\b',f:'\f'}[value]||value))
      const hex=literal!==null?Buffer.from(literal,'latin1').toString('hex'):m[2]||[...(m[3]||'').matchAll(/<([0-9a-f]+)>/gi)].map(x=>x[1]).join('')
      lines.push((hex.match(/.{4}/g)||[]).map(c=>fonts.get(current)?.get(parseInt(c,16))||'?').join(''))
    }
  }
  result.push({id,text:lines.join(''),fonts:[...fonts.keys()]})
}
writeFileSync('tmp/reference-text.json',JSON.stringify(result,null,2))
console.log(JSON.stringify(result,null,2))
