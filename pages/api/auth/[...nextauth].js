import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/signin',
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        return (
          (profile.email_verified &&
            profile.email.endsWith('@computercare.net')) ||
          profile.email == 'ccguest3350@gmail.com'
        );
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
});
