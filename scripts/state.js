import{
  load,save,loadSettings,saveSettings
} from './storage.js'
const DEFAULTS = {
  base: 'USD', rates:{ EUR: 0.92, RWF:1450},display: 'USD',cap:500,
  categories: ['Food','Books','Transport','Entertainment','Fees','Other']
}
export const state = { records: load(), settings: {...DEFAULTS,...loadSettings()}}
const subs =[]
export const subscribe = f => subs.push(f);
const commit = () => {save (state.records); saveSettings(state.settings);subs.forEach(f=>f())}
const now = () => new Date().toISOString()
export function nextId(){
  const n= Math.max(0,...state.records.map(r=>parseInt(String(r.id).replace(/\D/g, ''),10) || 0)) +1
  return 'rec_' + String(n).padStart(4,'0')
}
export function add (d){
  const t = now ()
  const rec = {id:nextId(),...d,amount:Number(d.amount),createdAt: t, updatedAt:t}
  state.records.push(rec); commit();return rec
}
export function update (id,d){
  const r = state.records.find(x=>x.id === id)
  Object.assign(r,d,{amount:Number(d.amount),updatedAt:now()});commit();
}
export function remove(id) {state.records=state.records.filter(r=>r.id !== id);commit()}
export function replaceAll(a) {state.records=a;commit()}
export function setSettings (s) {state.settings= {...state.settings,...s};commit()}
export const rateFor = c => (c===state.settings.base ? 1 : state.settings.rates[c] ?? 1)
export const money = n => `${(n*rateFor (state.settings.display)).toFixed(2)} ${state.settings.display}`
