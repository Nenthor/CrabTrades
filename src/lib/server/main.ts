import writeDB from '$lib/server/Crabbase.ts';

async function myAsyncOperation() {
  try {
    const result = await writeDB(123, 456, 'tes');
    console.log(result); // Output: "Async operation completed"
  } catch (error) {
    console.error('Error:', error);
  }
}

myAsyncOperation();

import { collection, addDoc } from 'firebase/firestore';

const docRef = crabbase.collection('testttttt').doc('sample');

await docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815,
});

const snapshot = await db.collection('users').get();
snapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});
