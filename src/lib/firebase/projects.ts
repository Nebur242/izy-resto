import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { app, db, storage } from './config';

interface FirebaseProject {
  app: FirebaseApp;
  firestore: Firestore;
}

export const projects: Record<string, FirebaseProject> = {
  main: {
    app,
    firestore: db
  }
};