import { BUCKET_ACCESS_TOKEN } from '$env/static/private';
import { Storage } from '@google-cloud/storage';

type BucketId = 'historical-stock-data';

const storage = getStorage();

/**
 * Fetches the content of a file from Google Cloud Bucket. (File needs to exist)
 * @param BucketId Id of the bucket
 * @param path Path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @returns The content of the file
 */
export async function fetchFile(bucketId: BucketId, path: string) {
  const bucket = getBucket(bucketId);
  const file = bucket.file(path);
  const [content] = await file.download();
  return content.toString();
}

/**
 * Create or update a file in Google Cloud Bucket.
 * @param bucketId Id of the bucket
 * @param path Path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @param content The content to write to the file
 * @returns The content of the file
 */
export async function uploadFile(bucketId: BucketId, path: string, content: string) {
  const bucket = getBucket(bucketId);
  const file = bucket.file(path);
  await file.save(content);
}

/**
 * Deletes a file from Google Cloud Bucket. (File needs to exist)
 * @param bucketId Id of the bucket
 * @param path Path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @param ignoreNotFound If `true`, the function will not throw an error if the file does not exist
 */
export async function deleteFile(bucketId: BucketId, path: string, ignoreNotFound = false) {
  const bucket = getBucket(bucketId);
  const file = bucket.file(path);
  await file.delete({ ignoreNotFound });
}

/**
 * Combines multiple files into one. (Files need to exist)
 * @param bucketId Id of the bucket
 * @param sources The files to combine. The order will be preserved. Example: `['test.txt', 'AAPL/1Day.json']`
 * @param destination The path to the file to create or overwrite. Example: `test.txt` or `AAPL/1Day.json`
 */
export async function combineFiles(bucketId: BucketId, sources: string[], destination: string) {
  const bucket = getBucket(bucketId);
  await bucket.combine(sources, destination);
}

/**
 * Checks if a file exists in Google Cloud Bucket.
 * @param bucketId The id of the bucket
 * @param path The path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @returns `true` if the file exists, `false` otherwise
 */
export async function fileExists(bucketId: BucketId, path: string) {
  const bucket = getBucket(bucketId);
  const file = bucket.file(path);
  return (await file.exists())[0];
}

/**
 * Renames a file in Google Cloud Bucket. (File needs to exist)
 * @param bucketId Id of the bucket
 * @param oldPath The current path to the file. Example: `test.txt` or `AAPL/1Day.json`
 * @param newPath The new path to the file. Example: `test2.txt` or `AAPL/1Day2.json`
 */
export async function renameFile(bucketId: BucketId, oldPath: string, newPath: string) {
  const bucket = getBucket(bucketId);
  const file = bucket.file(oldPath);
  await file.move(newPath);
}

function getStorage() {
  return new Storage({
    projectId: 'crabtrades',
    credentials: {
      type: 'service_account',
      project_id: 'crabtrades',
      private_key_id: '1c03a24a34ef6e9a9acf7622e6737a725e9d44c1',
      private_key: `-----BEGIN PRIVATE KEY-----\n${BUCKET_ACCESS_TOKEN}\n-----END PRIVATE KEY-----\n`,
      client_email: 'cloud-storage@crabtrades.iam.gserviceaccount.com',
      client_id: '102891660250361893261',
      universe_domain: 'googleapis.com',
    },
  });
}

function getBucket(bucketId: BucketId) {
  return storage.bucket(bucketId);
}
