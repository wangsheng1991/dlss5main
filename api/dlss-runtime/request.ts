import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../_lib/auth.js';
import { database } from '../../server/admin.js';
const clean = (v: unknown, limit: number) => typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,limit) : '';
/** Records an authenticated runtime-files request before attempting a notification.
 * Uses the fixed-destination Studio Worker with kind=runtime; never sends binaries.
 * Worker failure leaves the request intact with notified=false and notifyError.
 * The response distinguishes durable recording from accepted email notification;
 * neither confirms inbox arrival, manual review, or file delivery.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const {uid,email}=await requireUser(req);
  if(!email) return res.status(400).json({error:'An account email is required'});
  const body=req.body || {};
  const purpose=clean(body.purpose,2000), scenario=clean(body.scenario,2000), machine=clean(body.machine,200);
  if(!purpose || !scenario || !machine) return res.status(400).json({error:'Purpose, target game or development scenario, and machine configuration are required'});
  const db=database(), requests=db.collection('dlssRuntimeRequests');
  const ref=requests.doc();
  // Atomic per-account throttle: concurrent submissions cannot bypass the one-minute limit.
  const throttle=db.collection('dlssRuntimeRequestLimits').doc(uid);
  await db.runTransaction(async tx=>{
   const previous=await tx.get(throttle);
   const now=Date.now();
   if(now-Number(previous.data()?.lastRequestAt || 0)<60000) throw Object.assign(new Error('That request was just recorded'),{status:429,code:'too_soon'});
   tx.set(ref,{uid,email,purpose,scenario,machine,createdAt:new Date(now),status:'new',notified:false,notifyError:''});
   tx.set(throttle,{lastRequestAt:now});
  });
  let notified=false;
  let notifyError='';
  const webhook=process.env.STUDIO_NOTIFY_WEBHOOK;
  const secret=process.env.STUDIO_NOTIFY_SECRET;
  try {
   if(!webhook || !secret) throw new Error('Runtime notification is not configured');
   const response=await fetch(webhook,{
    method:'POST', headers:{'Content-Type':'application/json','x-studio-secret':secret},
    body:JSON.stringify({kind:'runtime',email,uid,machine,note:`Purpose: ${purpose}\nScenario: ${scenario}`}),
    signal:AbortSignal.timeout(10000),
   });
   if(!response.ok) throw new Error(`mailer answered ${response.status}`);
   const result=await response.json() as {ok?:boolean};
   if(result.ok!==true) throw new Error('mailer did not confirm acceptance');
   notified=true;
  } catch(error) {
   notifyError=String((error as Error)?.message || error).slice(0,300);
  }
  await ref.update({notified,notifyError});
  return res.status(200).json({ok:true,id:ref.id,recorded:true,notified,message:notified?'Recorded; notification accepted, awaiting a reply':'Recorded; notification failed, awaiting a reply'});
 } catch(error) {return fail(res,error);}
}
