import admin from 'firebase-admin'

let db: admin.firestore.Firestore

export function getDb(): admin.firestore.Firestore {
  if (db) return db

  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey?.replace(/\\n/g, '\n'),
      }),
    })
  }

  db = admin.firestore()
  return db
}
