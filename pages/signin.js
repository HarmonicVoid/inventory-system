import React from 'react';
import {
  getProviders,
  useSession,
  signIn as SignIntoProvider,
} from 'next-auth/react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

function SignIn({ providers }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return 'Loading...';
  }

  if (status === 'authenticated') {
    router.push('/');
  }

  return (
    <>
      {!session ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
            padding: 3,
          }}
        >
          <Card
            sx={{
              width: '600px',
              height: '300px',
              backgroundColor: '#202020',
              borderRadius: 5,
              elevation: 3,
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
                      variant="contained"
                      onClick={() =>
                        SignIntoProvider(provider.id, {
                          callbackUrl: `${
                            router.query.callbackUrl
                              ? router.query.callbackUrl
                              : window.location.origin
                          }`,
                        })
                      }
                    >
                      Sign in
                    </Button>
                  </div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <></>
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
