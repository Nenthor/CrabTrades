import type { Order } from '$lib/types';
import { crabbase } from './FirestoreApp';

/*
export async function getTest() {
  console.log('Getting test');
  const docRef = crabbase.collection('users').doc('alovelaceaiwgudakwzgd');

  await docRef.set({
    first: 'john',
    last: 'johnson',
    born: 22222,
  });
}
*/

export async function writeDB(order: Order) {
  const docRef = crabbase.collection('DataStuff').doc(order.date);
  await docRef.set(order);
}

export async function readDB() {
  const snapshot = await crabbase.collection('DataStuff').get();

  const arr: Order[] = [];

  snapshot.forEach((doc: any) => {
    //    console.log(/*doc.id, '=>',*/ doc.data());
    const d: Order = doc.data();
    arr.push(d);
    //    console.log(d.date)
  });
  return arr;
}
