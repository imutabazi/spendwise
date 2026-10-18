const KEY = 'spendwise:data', SKEY = 'spendwise:settings'
const read = (k,fb) => { try {const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb} catch {return fb;}}
export const hasData = () => localStorage.getItem(KEY) !== null
export const load = () => {const d = read(KEY, []); return Array.isArray(d) ? d : [];}
export const save = d => localStorage.setItem(KEY, JSON.stringify(d))
export const loadSettings = () => read (SKEY,{})
export const saveSettings = s => localStorage.setItem(SKEY, JSON.stringify(s))