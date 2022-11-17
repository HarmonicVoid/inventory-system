// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cookie from 'cookie';
import { adminApp } from './firebaseAdmin';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    adminApp
      .auth()
      .createSessionCookie(req.body.token, { expiresIn })
      .then((sessionCookie) => {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('token', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: expiresIn,
            sameSite: 'strict',
            path: '/',
          })
        );
        res.statusCode = 200;
        res.json({ success: true });
      });
  }
}
