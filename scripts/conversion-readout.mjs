import {createRequire} from 'node:module';
import fs from 'node:fs';
const repo=process.cwd(),r=createRequire(repo+'/package.json');
r('dotenv').config({path:repo+'/.env.local',quiet:true});
const {initializeApp,cert}=r('firebase-admin/app'),{getFirestore}=r('firebase-admin/firestore'),{getAuth}=r('firebase-admin/auth');
const a=initializeApp({credential:cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),projectId:process.env.FIREBASE_PROJECT_ID},'conversion-read');
const db=getFirestore(a,process.env.FIREBASE_DATABASE_ID);
db.settings({preferRest:true});
const cutoff=Date.now()-28*864e5;
const owner=(await getAuth(a).getUserByEmail('wustwangsheng@gmail.com')).uid;
const specs={
 users:['createdAt','tier'],
 image_operations:['uid','status','createdAt','completedAt','errorCode'],
 image_uploads:['uid','createdAt'],
 waffo_checkout_intents:['uid','createdAt','environment','plan'],
 conversion_events:['uid','createdAt','event','origin','dimensions'],
 conversion_checkout_responses:['uid','createdAt','outcome','httpStatus','code'],
 billing_orders:['uid','createdAt','provider','environment','kind','amountTotal','currency']
};
const all={};
for(const [col,fields]of Object.entries(specs)){
 const ss=await Promise.race([db.collection(col).select(...fields).limit(15001).get(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Read timeout: '+col)),25000))]);
 if(ss.size>15000)throw Error('Collection too large: '+col);
 all[col]=ss.docs.map(d=>({id:d.id,...d.data()}));
}
const ms=x=>typeof x==='number'?x:(x?.toMillis?x.toMillis():Date.parse(x||''));
const real=u=>u&&u!==owner&&!/^(conversion-qa|test|qa|smoke|waffo|highlights-smoke|acceptance)/i.test(u);
const stages=(start,removeOwner)=>{
 const arr=col=>all[col].filter(x=>ms(x.createdAt)>=start&&(!removeOwner||real(col==='users'?x.id:x.uid)));
 const users=arr('users'),uploads=arr('image_uploads'),jobs=arr('image_operations'),intents=arr('waffo_checkout_intents').filter(x=>x.environment==='prod');
 const prodUids=new Set(all.waffo_checkout_intents.filter(x=>x.environment==='prod').map(x=>x.uid));
 const paid=arr('billing_orders').filter(x=>x.provider==='waffo'&&prodUids.has(x.uid)&&x.kind==='subscription');
 const su=jobs.filter(x=>x.status==='SUCCEEDED');
 const count=xs=>new Set(xs.map(x=>x.uid)).size;
 const errors={};for(const j of jobs.filter(x=>x.status==='FAILED')){
 const code=typeof j.errorCode==='string' && /^provider_\d{3}$/.test(j.errorCode)?j.errorCode:'unclassified_legacy_error';
 errors[code]=(errors[code]||0)+1;
}
 const by={};for(const j of su)by[j.uid]=(by[j.uid]||0)+1;
 return {since:new Date(start).toISOString(),exclude_owner_and_named_test_uids:removeOwner,
 account_records:users.length,upload_tickets:uploads.length,upload_accounts:count(uploads),jobs:jobs.length,job_accounts:count(jobs),
 successful_jobs:su.length,successful_accounts:count(su),repeat_success_accounts:Object.values(by).filter(n=>n>=2).length,
 job_states:jobs.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{}),failed_codes:errors,
 checkout_intents:intents.length,checkout_accounts:count(intents),
 first_party_events:arr('conversion_events').reduce((a,x)=>{const k=x.event;(a[k]??={events:0,accounts:[]}).events++; if(!a[k].accounts.includes(x.uid))a[k].accounts.push(x.uid);return a;},{}),
 checkout_response_outcomes:arr('conversion_checkout_responses').reduce((a,x)=>(a[x.outcome]=(a[x.outcome]||0)+1,a),{}),
 paid_period_records:paid.length,paid_accounts:count(paid)};
};
const paid=all.billing_orders.filter(x=>x.provider==='waffo'&&all.waffo_checkout_intents.some(i=>i.uid===x.uid&&i.environment==='prod')&&x.kind==='subscription').sort((a,b)=>ms(a.createdAt)-ms(b.createdAt));
const t=paid[0]?ms(paid[0].createdAt):null;
const cohortSignups=all.users.filter(u=>ms(u.createdAt)>=cutoff);
const cohortIds=new Set(cohortSignups.map(u=>u.id));
const cohortJobs=all.image_operations.filter(j=>cohortIds.has(j.uid)&&ms(j.createdAt)>=cutoff);
const report={cohort28d:{signups:cohortIds.size,submitted_accounts:new Set(cohortJobs.map(j=>j.uid)).size,
 success_accounts:new Set(cohortJobs.filter(j=>j.status==='SUCCEEDED').map(j=>j.uid)).size,
 paid_accounts:new Set(paid.filter(x=>cohortIds.has(x.uid)).map(x=>x.uid)).size},
captured_at:new Date().toISOString(),bounded_rows:Object.fromEntries(Object.entries(all).map(([k,v])=>[k,v.length])),
 note:'Only selected database fields. Upload ticket does not prove uploaded bytes. Named-test filtering is a heuristic; owner is separately known. Paid records are verified application ledger, not bank settlement.',
 first_paid_at:t?new Date(t).toISOString():null,first_paid_is_owner:paid[0]?paid[0].uid===owner:null,additional_paid_records:t?paid.filter(p=>ms(p.createdAt)>t).length:0,
 last28d:stages(cutoff,false),last28d_excluding_owner:stages(cutoff,true),
 since_first_payment:t?stages(t,false):null,since_first_payment_excluding_owner:t?stages(t,true):null};
for(const k of ['last28d','last28d_excluding_owner','since_first_payment','since_first_payment_excluding_owner']){
 if(report[k])for(const e of Object.values(report[k].first_party_events)){e.accounts=e.accounts.length;}
}
const out=process.argv[2];
if(out)fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n',{mode:0o600});console.log(JSON.stringify(report,null,2));
await a.delete();
