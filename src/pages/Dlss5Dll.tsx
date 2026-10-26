import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import SEO from '../components/SEO';
import Dlss5DllContent from '../components/Dlss5DllContent';
import { useAuth } from '../contexts/AuthContext';
import { DLL_COPY, DLL_ALTERNATES, dllPath, dllSchema, type DllLocale } from '../content/dlss5Dll';
function RequestForm({locale}: {locale: DllLocale}) {
 const {user}=useAuth(); const c=DLL_COPY[locale];
 const [busy,setBusy]=useState(false), [sent,setSent]=useState(false), [error,setError]=useState('');
 const pending=useRef(false);
 async function submit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault(); if(!user || pending.current || sent) return;
  const data=new FormData(e.currentTarget); pending.current=true; setBusy(true); setError('');
  try {
   const token=await user.getIdToken();
   const response=await fetch('/api/dlss-runtime/request',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({purpose:data.get('purpose'),scenario:data.get('scenario'),machine:data.get('machine')})});
   const result=await response.json();
   if(!response.ok || !result.recorded || !result.id) throw new Error(c.error);
   setSent(true);
  } catch {setError(c.error);} finally {pending.current=false;setBusy(false);}
 }
 if(!user) return <p>{c.login} <a className="text-primary underline" href="/login">{c.loginLink}</a></p>;
 if(sent) return <p role="status">{c.success}</p>;
 return <form onSubmit={submit} className="space-y-4">{['purpose','scenario','machine'].map((name,i)=><label className="block" key={name}>{c.fields[i]}<textarea className="block w-full bg-zinc-900 border p-3" name={name} required maxLength={name==='machine'?200:2000}/></label>)}<button className="bg-primary text-black p-3" disabled={busy}>{busy?c.busy:c.submit}</button>{error && <p role="alert">{error}</p>}</form>;
}
export default function Dlss5Dll({locale='en'}: {locale?: DllLocale}) {
 const c=DLL_COPY[locale];
 const {i18n}=useTranslation();
 useEffect(()=>{void i18n.changeLanguage(locale==='zh'?'zh-CN':'en-US');},[i18n,locale]);
 return <><SEO title={c.title} description={c.assertions[0]} canonical={dllPath(locale)} language={locale==='zh'?'zh-CN':'en-US'} alternates={DLL_ALTERNATES} structuredData={dllSchema(locale)}/><Dlss5DllContent locale={locale} request={<RequestForm locale={locale}/>}/></>;
}
