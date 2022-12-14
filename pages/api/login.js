// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cookie from 'cookie';
import { adminApp } from './firebaseAdmin';

export default function handler(req, res) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  adminApp
    .auth()
    .verifyIdToken(req.body.token)
    .then((decodedToken) => {
      if (
        decodedToken.email == req.body.email &&
        decodedToken.uid == req.body.fid
      ) {
        adminApp
          .auth()
          .createSessionCookie(req.body.token, { expiresIn })
          .then((sessionCookie) => {
            res.setHeader(
              'Set-Cookie',
              cookie.serialize('token', sessionCookie, {
                httpOnly: true,
                secure: true,
                maxAge: expiresIn,
                sameSite: 'strict',
                path: '/',
              })
            );
            res.statusCode = 200;
            res.json({ success: true, location: decodedToken.location });
          });
      } else {
        res.statusCode = 401;
        res.json({ success: false });
      }
    })
    .catch((error) => {
      // Handle error
      console.log(error);
      res.statusCode = 500;
    });
}
