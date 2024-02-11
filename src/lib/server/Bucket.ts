import { BUCKET_ACCESS_TOKEN } from '$env/static/private';

type BucketId = 'historical-stock-data';

/**
 * Fetches the content of a file from Google Cloud Bucket. (File needs to exist)
 * @param BucketId Id of the bucket
 * @param path Path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @returns The content of the file
 */
export async function fetchFile(BucketId: BucketId, path: string) {
  const file = await fetch(`http://storage.googleapis.com/${BucketId}/${path}`, {
    headers: {
      Authorization: `Bearer ${BUCKET_ACCESS_TOKEN}`,
    },
  });

  if (!file.ok) throw new Error(`Failed to fetch file: ${file.status} ${file.statusText}`);

  return await file.text();
}

/**
 * Create or update a file in Google Cloud Bucket.
 * @param BucketId Id of the bucket
 * @param path Path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @param content The content to write to the file
 * @returns The content of the file
 */
export async function uploadFile(BucketId: BucketId, path: string, content: string) {
  const file = await fetch(`http://storage.googleapis.com/${BucketId}/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${BUCKET_ACCESS_TOKEN}`,
    },
    body: content,
  });

  if (!file.ok) throw new Error(`Failed to upload file: ${file.status} ${file.statusText}`);
}
