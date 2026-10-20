import * as S from "./state.js"
import { hasData } from "./storage.js"
import {validate,validateRecord,validateImport,warnDuplicate,} from "./validators.js"
import { compileRegex } from "./search.js"
import * as UI from "./ui.js"
const $ = (s) => document.querySelector(s)
let editing = null
let fresh = null 
const sorters = {
  "date-d": (a,b) => b.date.localeCompare(a.date),
  "date-a": (a,b)=>a.date.localeCompare(b.date),
  "desc-a": (a,b) => a.description.localeCompare(b.description),
  "desc-b":(a,b)=>b.description.localeCompare(a.description),
  "amt-a":(a,b)=>a.amount-b.amount,
  "amt-b": (a,b)=>b.amount-a.amount
}

function render(){
  const q = $("#q").value,
  re=compileRegex(q,$("#ci").checked ? "i" : "")
  $("#q-err").textContent= 
  q && !re ? "Invalid pattern. Check brackets and escapes." : "";
  $("#q").setAttribute("aria-invalid",String(!!(q&&!re)))
  const rows = S.state.records.filter((r)=>!re || [r.description,r.category,String(r.amount),r.date].some((v)=>re.test(v))
).sort(sorters[$("#sort").value]);
UI.renderTable(rows, re, editing, fresh)
UI.renderStats()
UI.renderSettings()
}
S.subscribe(render);
["description","amount","category","date"].forEach( (f)=> { 
  const el = $("#form").elements[f];
  el.addEventListener('input', () => {
    const err = validate(f,el.value)
    $("#e-"+f).textContent= err || (f==="description" ? warnDuplicate(el.value): "")
  el.setAttribute("aria-invalid",String(!!err))
  })
 });
$("#form").addEventListener("submit",(e)=>{
  e.preventDefault()
  const d = Object.fromEntries(new FormData(e.target))
  const errs = validateRecord(d);
  ["description","amount","category","date"].forEach((f)=>{
    $("#e-"+f).textContent = errs[f] || "";
    e.target.elements[f].setAttribute("aria-invalid",String(!!errs[f]));
  })
  const first = Object.keys(errs)[0]
  if(first){
    e.target.elements[first].focus();
    return UI.say("Fix the highlighted fields")
  }
  fresh= S.add(d).id;
  e.target.reset();
  UI.say("Transaction added")
  location.hash="#records"
})

$("#rows").addEventListener("click",(e)=>{
  const btn = e.target.closest("button");
  if(!btn) return ;
  const tr = btn.closest("tr"),
  id=tr.dataset.id,
  act=btn.dataset.act;
  if(act === "edit"){
    editing = id;
    render();
    $(`#rows tr[data-id="${id}"] input`).focus()
  }
  if(act==="cancel"){
    editing= null;
    render()
  }
  if(act==="del"){
      const r = S.state.records.find((x)=>x.id===id);
      if(confirm(`Delete "${r.description}"?`)){
        S.remove(id);
        UI.say("Transaction deleted.")
      }
    }
  if(act==="save"){
    const d= Object.fromEntries([...tr.querySelectorAll('input')].map((i)=>[i.name,i.value]),
  );
  const errs = validateRecord(d),
  k = Object.keys(errs)[0];
  if(k){
    tr.querySelector(`[name=${k}]`).focus();
    return UI.say(`${k}: ${errs[k]}`)
  }
  editing = null;
  S.update(id,d);
  UI.say("Transaction updated.")
  }
});

["#q","#ci","#sort"].forEach((s)=>$(s).addEventListener("input",()=>{
  fresh = null;
  render()
}))

$("#set-form").addEventListener("submit",(e)=>{
  e.preventDefault();
  const v = (id) => $(id).value.trim();
  const codes = [v("#s-base"),v("#s-c2"),v("#s-c3")].map((c)=>c.toUpperCase())
  const errs = {
    base: validate("currency",codes[0]),
    rate:
    [
      validate("currency",codes[1]),
      validate("currency",codes[2]),
      validate("rate",v("#s-r2")),
      validate("rate",v("#s-r3"))
    ].find(Boolean) || "",
    cap:validate("amount",v("#s-cap")),
    cats:
    v("#s-cats").split(",").map((c)=>validate("category",c.trim())).find(Boolean) || "",
  };
  Object.entries(errs).forEach(([k,m])=> ($("#e-"+k).textContent=m))
  if (Object.values(errs).some(Boolean)) return UI.say("Fix the highlighted settings")
    const disp = $("#s-disp").value;
  S.setSettings({
    base:codes[0],
    rates: {[codes[1]]: +v("#s-r2"), [codes[2]]: +v("#s-r3")},
    display:codes.includes(disp) ? disp : codes[0],
    cap: +v("#s-cap"),
    categories: v("#s-cats").split(",").map((c)=>c.trim())
  });
  UI.say("Settings saved")
})
$("#export").addEventListener("click",()=>{
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(
      new Blob([JSON.stringify(S.state.records,null,2)],{
        type:"application/json",
      }),
    ),
    download:"spendwise.json"
  });
  a.click();
  URL.revokeObjectURL(a.href);
  UI.say("Exported JSON")
});
$("#import").addEventListener("change",async(e)=>{
  const file = e.target.files[0];
  if(!file) return;
  try{
    const data = JSON.parse(await file.text()),
    res = validateImport(data);
    if(!res.ok)
      UI.say(`Import rejected: ${res.errors.slice(0,3).join("; ")}`);
    else {
      S.replaceAll(data);
      UI.say(`Imported ${data.length} records. `)
    }
  } catch {
    UI.say("Import failed: file is not valid JSON")
  }
  e.target.value =""
})
async function loadSeed(){
  try {
    S.replaceAll(await (await fetch("seed.json")).json());
    UI.say("Seed data loaded")
  } catch {
    UI.say("Could not load seed.json. Serve the folder over http")
  }
}
$("#reset").addEventListener(
  "click",
  ()=>confirm ("Replace all records with seed data?") && loadSeed()
)

window.addEventListener("hashchange", ()=>UI.showSection(location.hash.slice(1)))
render()
UI.showSection(location.hash.slice(1))
if(!hasData()) loadSeed()
