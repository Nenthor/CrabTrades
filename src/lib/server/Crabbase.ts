import type { Order, Statics } from '$lib/types';
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
  const regexp: RegExp = /[()]/gi;
  const regexp2: RegExp = /[/]/gi;

  if (
    !regexp.test(order.symbol) &&
    !regexp2.test(order.symbol) &&
    !regexp.test(order.date) &&
    !regexp2.test(order.date) &&
    (order.decision == 'BUY' || order.decision == 'SELL')
  ) {
    //check for brackets
    console.log('execute writeDB');
    const docRef = crabbase.collection('DataStuff').doc(order.date);
    await docRef.set(order);

    console.log('execute write on curent'); // write on current
    const docRef2 = crabbase.collection('current').doc('currentDate');
    await docRef2.set(order);

    return true;
  } else {
    return false;
  }
}

export async function writeStatic(statics: Statics) {
  console.log('write Static'); // write on current
  const docRef2 = crabbase.collection('current').doc('Static');
  await docRef2.set(statics);
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

export async function readCurrent() {
  //array value 1 is recent, array value 0 is statics
  const snapshot = await crabbase.collection('current').get();

  const arr: Order[] = [];

  snapshot.forEach((doc: any) => {
    //    console.log(/*doc.id, '=>',*/ doc.data());
    const d: Order = doc.data();
    arr.push(d);
    //    console.log(d.date)
  });
  return arr;
}
