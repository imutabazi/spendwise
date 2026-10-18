export const RULES = {
  description : {re:/^(?!.*\s{2})\S(?:.*\S)?$/, msg:'No leading, trailing or double spaces.'},
  amount: {re: /^(0|[1-9]\d*)(\.\d{1,2})?$/, msg:'Use a number like 12 or 12.50'},
  date: {re: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,msg:'Use YYYY-MM-DD.'},
  category: {re: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,msg:'Letter, spaces and hyphens only.'},
  currency: {re: /^[A-Z]{3}$/,msg:'Use a 3-letter code like USD.'},
  rate: {re: /^(0|[1-9]\d*)(\.\d{1,6})?$/,msg:"Use a positive number like 0.92"}
}

export const DUP_WORD = /\b(\w+)\s+\1\b/i
export function validate(field,value){
  const r = RULES[field], v = String(value?? '');
  if(!r) return '';
  if (!r.re.test(v)) return v === ''? 'Required.' : r.msg;
  if(field==='date'){
    const [y,m,d]= v.split('-').map(Number),dt = new Date(Date.UTC(y, m -1,d))
    if (dt.getUTCMonth() !== m-1) return 'That date does not exist.'
  }
  return ''
}
export const warnDuplicate = v => (DUP_WORD.test(v)?'Heads up: repeated word':'');
export function validateRecord(r){
  const errs={}
  for (const f of ['description','amount','category','date']){
    const e= validate(f, r[f]); if (e) errs[f]=e;
  }
  return errs;
}
export function validateImport (data){
  const errors = []
  if(!Array.isArray(data)) return {ok: false , errors:['File must contain a JSON array']}
  const ids = new Set ();
  data.forEach((r,i)=>{
    const n = `#${i+1}`;
    if (!r || typeof r !== 'object') return errors.push(`${n}: not an object`)
    if (typeof r.id !== 'string' || !r.id) errors.push (`${n}: missing id`)
    else if (ids.has(r.id)) errors.push(`${n}:duplicate id ${r.id}`)
  else ids.add(r.id)
if(typeof r.amount !== 'number' || r.amount <0) errors.push(`${n}: amount must be a number ≥ 0`)
  Object.entries(validateRecord({...r,amount:String(r.amount)})).forEach(([k,m])=>errors.push(`${n} ${k}: ${m}`));
if (typeof r.createdAt !== 'string' || typeof r.updatedAt !== 'string') errors.push(`${n}: missing timestamps`)
  })
return { ok:errors.length===0,errors}
}