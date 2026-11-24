import assert from 'node:assert/strict';
import { test } from './harness';
import { parseFunnelEvent, funnelFields, funnelErrorCategory } from '../lib/conversion-events';

test('conversion endpoint strips personal content and rejects invented events or invalid idempotency keys', () => {
  const id = '7ab91912-0996-41d5-b1c3-a9d6d77aac01';
  assert.equal(parseFunnelEvent({ event: 'purchase', id }), null);
  assert.equal(parseFunnelEvent({ event: 'pricing_view', id: '../account' }), null);
  assert.deepEqual(parseFunnelEvent({ event: 'plan_select', id, uid: 'victim', dimensions: {
    plan: 'pro', email: 'private@example.com', prompt: 'sensitive', filename: 'person.png',
    source: 'https://private.example', tool: '<script>', provider: 'waffo',
  } }), {event: 'plan_select', id, dimensions: { plan: 'pro', provider: 'waffo' }});
  assert.deepEqual(funnelFields({plan:'pro\nprivate', source:{uid:'secret'}, error_category:'authentication'}), {error_category:'authentication'});
});

import { recordConversion } from '../server/conversion-log';
import type { Firestore } from 'firebase-admin/firestore';

test('conversion records are owner scoped, idempotent and bounded, without financial writes', async () => {
  const records = new Map<string, Record<string, any>>();
  const db = {
    doc: (id: string) => ({id}),
    runTransaction: async (callback: (tx: unknown) => Promise<unknown>) => callback({
      getAll: async (...refs: Array<{id:string}>) => refs.map(r => ({exists:records.has(r.id),data:()=>records.get(r.id)})),
      create: (r: {id:string}, value:Record<string,any>) => { assert(!records.has(r.id));records.set(r.id,value); },
      set: (r:{id:string}, value:Record<string,any>) => records.set(r.id,value),
    }),
  } as unknown as Firestore;
  const event={event:'pricing_view',id:'7ab91912-0996-41d5-b1c3-a9d6d77aac01',uid:'someone-else'};
  assert.equal(await recordConversion('owner-one',event,'browser',db),'recorded');
  assert.equal(await recordConversion('owner-one',event,'browser',db),'duplicate');
  assert.equal(await recordConversion('owner-two',event,'browser',db),'recorded');
  const saved=[...records].filter(([k])=>k.startsWith('conversion_events/'));
  assert.equal(saved.length,2); assert.equal(saved[0][1].uid,'owner-one');
  for (const [key,value] of records) if(key.startsWith('conversion_event_limits/')) value.count=200;
  assert.equal(await recordConversion('owner-one',{...event,id:'7ab91912-0996-41d5-b1c3-a9d6d77aac02'},'browser',db),'limited');
  assert.equal(records.size,4);
  assert.equal(await recordConversion('owner-one',{event:'purchase'},'browser',db),'invalid');
});

test('generation request errors distinguish credit exhaustion from provider outages without logging text', () => {
  assert.equal(funnelErrorCategory(402), 'credits'); assert.equal(funnelErrorCategory(429), 'rate_limit');
  assert.equal(funnelErrorCategory(422), 'validation'); assert.equal(funnelErrorCategory(503), 'provider');
  assert.equal(funnelErrorCategory(401), 'authentication'); assert.equal(funnelErrorCategory(), 'network');
});
