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

export async function writeDB(a: number, b: number, c: string) {
  //if(typeof a == typeof(number) && typeof b == typeof(number) && typeof c == typeof(string)){
  console.log('execute writeDB');
  const docRef = crabbase.collection('DataStuff').doc('BigData');

  await docRef.set({
    //need to change to variables
    Aa: a,
    Ba: b,
    Ca: c,
  });

  //}
}
