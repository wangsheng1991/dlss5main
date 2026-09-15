type Value = { stringValue?: string; integerValue?: string; booleanValue?: boolean };
const base = () => {
  const project = process.env.FIREBASE_PROJECT_ID;
  const database = process.env.FIREBASE_DATABASE_ID;
  if (!project || !database) throw Object.assign(new Error('Firestore is not configured'), { status: 503 });
  return `https://firestore.googleapis.com/v1/projects/${project}/databases/${database}/documents`;
};
const fields = (input: Record<string, string | number | boolean>) => Object.fromEntries(Object.entries(input).map(([k, v]) => [k, typeof v === 'number' ? { integerValue: String(v) } : typeof v === 'boolean' ? { booleanValue: v } : { stringValue: v }]));
export async function createOperation(id: string, token: string, data: Record<string, string | number | boolean>) {
  const r = await fetch(`${base()}/image_operations?documentId=${encodeURIComponent(id)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: fields(data) }), signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw Object.assign(new Error('Unable to persist image operation'), { status: r.status === 409 ? 409 : 503 });
}
export async function getOperation(id: string, token: string) {
  const r = await fetch(`${base()}/image_operations/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) });
  if (r.status === 404) return null;
  if (!r.ok) throw Object.assign(new Error('Unable to read image operation'), { status: 503 });
  const j = await r.json() as { fields?: Record<string, Value> };
  const f = j.fields || {};
  return Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.stringValue ?? v.integerValue ?? v.booleanValue])) as Record<string, string | number | boolean>;
}
export async function reserveCredit(uid: string, token: string) {
  const url = `${base()}/users/${encodeURIComponent(uid)}`;
  const current = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) });
  if (!current.ok) throw Object.assign(new Error('Unable to read account quota'), { status: 403 });
  const doc = await current.json() as { updateTime?: string; fields?: { credits?: Value } };
  const credits = Number(doc.fields?.credits?.integerValue ?? 0);
  if (!doc.updateTime || !Number.isSafeInteger(credits) || credits < 1) throw Object.assign(new Error('Insufficient credits'), { status: 402 });
  const updated = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { credits: { integerValue: String(credits - 1) } }, currentDocument: { updateTime: doc.updateTime } }), signal: AbortSignal.timeout(10000) });
  if (!updated.ok) throw Object.assign(new Error('Quota changed; please retry'), { status: 409 });
}
export async function refundCredit(uid: string, token: string) {
  const url = `${base()}/users/${encodeURIComponent(uid)}`;
  const current = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) });
  if (!current.ok) throw new Error('Unable to read account for refund');
  const doc = await current.json() as { updateTime?: string; fields?: { credits?: Value } };
  const credits = Number(doc.fields?.credits?.integerValue ?? 0);
  if (!doc.updateTime || !Number.isSafeInteger(credits)) throw new Error('Invalid account quota');
  const updated = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { credits: { integerValue: String(credits + 1) } }, currentDocument: { updateTime: doc.updateTime } }), signal: AbortSignal.timeout(10000) });
  if (!updated.ok) throw new Error('Credit refund requires reconciliation');
}
