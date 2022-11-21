import React, { useState } from 'react';
import {
  getProviders,
  useSession,
  signIn as SignIntoProvider,
} from 'next-auth/react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

function SignIn({ providers }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  if (status === 'authenticated') {
    signInWithCustomToken(auth, session.firebaseToken)
      .then((userCredential) => {
        // console.log(userCredential);
        // Signed in
        fetch('/api/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: userCredential.user.accessToken,
          }),
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        signOut();
      });

    router.push('/');
  }

  if (status === 'loading') {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress thickness={3} size="70px" />
      </Box>
    );
  }

  return (
    <>
      {session ? (
        <Box
          sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress thickness={3} size="70px" />
          <h3>authenticating...</h3>
        </Box>
      ) : (
        <div className="pageContainer">
          <Card
            sx={{
              width: '600px',
              height: '300px',
              backgroundColor: '#202020',
              borderRadius: 5,
              elevation: 3,
              margin: 1,
              marginTop: '100px',
            }}
          >
            <CardContent sx={{ height: '100%' }}>
              <Typography sx={{ marginTop: 5 }} align="center" variant="h6">
                Welcome,
              </Typography>
              <Typography sx={{ marginTop: 1 }} align="center" variant="h6">
                please log in with your work credentials
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50%',
                }}
              >
                {Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                    <Button
                      disabled={loading ? true : false}
                      variant="contained"
                      onClick={() => {
                        setLoading(true);
                        SignIntoProvider(provider.id, {
                          callbackUrl: `${
                            router.query.callbackUrl
                              ? router.query.callbackUrl
                              : '/signin'
                          }`,
                        });
                      }}
                    >
                      {loading ? 'REDIRECTING...' : 'SIGN IN'}
                    </Button>
                  </div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default SignIn;
