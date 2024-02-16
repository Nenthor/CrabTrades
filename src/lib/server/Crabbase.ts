import { crabbase } from './FirestoreApp';

export async function getTest() {
  console.log('Getting test');
  const docRef = crabbase.collection('users').doc('alovelaceaiwgudakwzgd');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815,
  });
}
