import { DB_TOKEN } from '$env/static/private';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const credential: any = {
  type: 'service_account',
  project_id: 'crabtrades',
  private_key_id: '94673abd0eb4ef5e23184dc329b39b03ade707e9',
  private_key: `-----BEGIN PRIVATE KEY-----\n${DB_TOKEN}\n-----END PRIVATE KEY-----`.replace(/\\n/g, '\n'),
  client_email: 'firebase-adminsdk-qa7bz@crabtrades.iam.gserviceaccount.com',
  client_id: '109732850022201324142',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qa7bz%40crabtrades.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

if (!getApps().length) {
  initializeApp({ credential: cert(credential) });
}

export const crabbase = getFirestore(getApp());
