import { highlight,esc } from "./search.js";
import { state,money,rateFor } from "./state.js";
const $ = s => document.querySelector(s)
export const say = msg => {const el = $("#status");el.textContent= '';setTimeout(()=>(el.textContent=msg),30)}
const HEADS = {dashboard: 'dash',records:'rec',add:'add',settings:'set',about:'about'}
export function showSection(id){
  if(!HEADS[id]) id = 'dashboard';
  Object.keys(HEADS).forEach(s=>($('#'+ s).hidden=s !== id));
  document.querySelectorAll('nav a').forEach(a=>{
    if(a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current')
  })
$('#h-'+HEADS[id]).focus();
}

const viewRow = (r,re,fresh) => `<tr data-id="${esc(r.id)}"${r.id === fresh ? ' class="new"': ''}>
<td data-label="Date">${highlight(r.date,re)}</td>
<td data-label="Description">${highlight(r.description,re)}</td>
<td data-label="Category">${highlight(r.category,re)}</td>
<td data-label="Amount">${highlight(money(r.amount),re)}</td>
<td data-label="Actions"><span class="row">
 <button type="button" class="ghost" data-act="edit" aria-label="Edit ${esc(r.description)}">Edit</button>
 <button type="button" class="danger" data-act="del" aria-label="Delete ${esc(r.description)}">Delete</button></span></td></tr>
`
const editRow = r => `<tr data-id="${esc(r.id)}">
  <td data-label="Date"><input aria-label="Date" name="date" value="${esc(r.table)}"></td>
  <td data-label="Description"><input aria-label="Description" name="description" value="${esc(r.description)}"></td>
  <td data-label="Category"><input aria-label="Category" name="category" value="${esc(r.category)}"></td>
  <td data-label="Amount"><input aria-label="Amount in base currency" name="amount" value="${esc(r.amount)}"></td>
  <td data-label="Actions"><span class="row">
  <button type="button" data-act="save">Save</button>
  <button type="button" class="ghost" data-act="cancel">Cancel</button></span></td></tr>
`
export function renderTable (rows,re, editingId,freshId){
  $('#rows').innerHTML=rows.map(r=>(r.id===editingId ? editRow(r) : viewRow(r,re,freshId))).join('');
  $('#empty').hidden = rows.length > 0
}

export function renderStats(){
  const recs = state.records, {cap, display} = state.settings;
  const sum = recs.reduce((a,r)=>a+r.amount,0),byCat={};
  recs.forEach(r=>(byCat[r.category]= (byCat[r.category] || 0) +r.amount))
  const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0]
  $('#s-count').textContent=recs.length
  $('#s-sum').textContent=money(sum)
  $('#s-top').textContent=top ? `${top[0]} (${money(top[1])})` : '-';
  const diff = cap-sum,p=$('#cap-polite'),a = $('#cap-assertive');
  const capText = money(cap);
  p.textContent='';a.textContent='';
  if(diff>=0) p.textContent = `${money(diff)} remaining of your ${capText} cap`
  else a.textContent = `Over your ${capText} cap by ${money(-diff)}`

  const days = [...Array(7)].map((_,i)=>{const d = new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10);})
  const totals = days.map(d=>recs.filter(r=>r.date===d).reduce((x,r)=>x+r.amount,0))
  const max = Math.max(...totals,1)
  $('#trend').innerHTML=days.map((d,i)=>`<li><span>${totals[i] ? money(totals[i]):''}</span><div class="bar" style="height:${(totals[i]/max)*80}%"></div><span>${d.slice(5)}</span></li>`).join('')
}
export function renderSettings(){
  const s= state.settings,[c2,c3]= Object.keys(s.rates)
  const set = (id,v) => {if (document.activeElement !== $(id))$(id).value=v}
  set('#s-base',s.base);set('#s-c2',c2||'');set('#s-r2',s.rates[c2]?? '')
  set('#s-c3',c3 || '');set('#s-r3',s.rates[c3] ?? ''); set('#s-cap',s.cap);set('#s-cats',s.categories.join(', '))
  $('#s-disp').innerHTML=[s.base,c2,c3].filter(Boolean).map(c=>`<option${c===s.display? ' selected' : ''}>${esc(c)}</option>`).join('');
  $('#cats').innerHTML = s.categories.map(c=>`<option value="${esc(c)}">`).join('')
}