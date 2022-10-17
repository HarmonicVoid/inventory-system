import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { signIn, signOut } from 'next-auth/react';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  // adapter: FirestoreAdapter({
  //   apiKey: process.env.API_KEY,
  //   appId: process.env.APP_ID,
  //   authDomain: process.env.AUTH_DOMAIN,
  //   databaseURL: process.env.FIREBASE_DATABASE_URL,
  //   projectId: process.env.PROJECT_ID,
  //   storageBucket: process.env.STORAGE_BUCKET,
  //   messagingSenderId: process.env.MESSAGE_SENDER_ID,
  // }),
  pages: {
    signIn: '/signin',
  },

  // callbacks: {
  //   async session({ session, token, user }) {
  //     session.user.username = session.user.name
  //       .split(' ')
  //       .join('')
  //       .toLocaleLowerCase();
  //     session.userId = user.id;

  //     // session.user.uid = token;
  //     return session;
  //   },
  //   async signIn({ account, profile }) {
  //     if (account.provider === 'google') {
  //       return profile.email.endsWith('@computercare.net');
  //     }
  //     return true; // Do different verification for other providers that don't have `email_verified`
  //   },
  // },
});
