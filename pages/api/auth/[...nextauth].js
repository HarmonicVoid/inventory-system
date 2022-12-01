import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { adminApp } from '../firebaseAdmin';

const db2 = adminApp.firestore();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/signin',
  },

  callbacks: {
    async signIn({ user }) {
      const isAllowedToSignIn = await VerifyAuth(user.email);

      if (isAllowedToSignIn || user.email == process.env.EMAIL_SECRET) {
        await adminApp
          .auth()
          .createUser({
            uid: user.id,
            email: user.email,
          })
          .catch((error) => {
            console.log('Error creating new user:', error);
          });

        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      const additionalClaims = {
        admin: true,
        location: '0000547264',
      };
      await adminApp
        .auth()
        .createCustomToken(token.sub, additionalClaims)
        .then((firebaseToken) => {
          token.firebaseToken = firebaseToken;
        })
        .catch((error) => {
          console.log('Error creating token:', error);
        });
      return token;
    },
    async session({ session, token }) {
      session.userId = token.sub;
      session.firebaseToken = token.firebaseToken;

      return session;
    },
  },
});

const VerifyAuth = async (email) => {
  const data = await db2.collection('authUsers').where('email', '==', email);

  const emailIsEmpty = (await data.get()).empty;

  if (emailIsEmpty == false) {
    return true;
  } else {
    return false;
  }
};
