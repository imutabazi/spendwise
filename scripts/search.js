export function compileRegex (input,flags = "i"){
  try{
    return input ? new RegExp (input, flags) : null
  } catch {
    return null;
  }
}
export const esc = (s) => 
  String(s).replace(/[&<>"']/g, 
    (c)=>({
    "&": "&amp","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c],)

export function hightlight (text,re){
  const s= String(text)
  if(!re) return esc(s)
  const g = new RegExp(
re.source,
re.flags.includes("g") ? re.flags + 'g',
)
let out = "",
last =0,
m;

while ((m=g.exec(s))){
  if(!m[0]){
    g.lastIndex++;
    continue
  }
  out += esc(s.slice(last,m.index)) + "<mark>" + esc(m[0]) + "</mark>";
  last = m.index+m[0].length;
}
 return out + esc(s.slice(last));
}