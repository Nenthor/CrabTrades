import type { Auth, Order, Static } from '$lib/types';
import { crabbase } from './FirestoreApp';

export const MAX_QUANTITY = 15;
export const MIN_QUANTITY = 6;

export async function writeOrder(order: Order) {
  const regexp: RegExp = /[()]/gi;
  const regexp2: RegExp = /[/]/gi;

  if (!regexp.test(order.symbol) && !regexp2.test(order.symbol) && (order.decision == 'BUY' || order.decision == 'SELL')) {
    // Add Order to collection
    const docRef = crabbase.collection('DataStuff').doc(order.date.toISOString());
    await docRef.set(order);

    // Update Order Count
    const staticValues = await readStatic();
    staticValues.orderCount++;
    await writeStatic(staticValues);

    return true;
  } else {
    return false;
  }
}

export async function logAuth(username: string, password: string) {
  //check for brackets

  const auth: Auth = { username, password };
  var date = new Date();
  console.log('logging auth');
  const docRef = crabbase.collection('Auth').doc(date.toISOString());
  await docRef.set(auth);
}

export async function readDB(startTime = new Date(0)) {
  const snapshot = await crabbase.collection('DataStuff').where('date', '>', startTime).get();

  const arr: Order[] = [];

  snapshot.forEach((doc: any) => {
    const d: Order = doc.data();
    d.date = new Date((d.date as any)._seconds * 1000); // Firebase TimeStamp to Date object
    arr.push(d);
  });
  return arr;
}

export async function readStatic() {
  const doc = await crabbase.collection('Static').doc('static').get();
  return doc.data() as Static;
}

export async function writeStatic(statics: Static) {
  const docRef2 = crabbase.collection('Static').doc('static');
  await docRef2.set(statics);
}
