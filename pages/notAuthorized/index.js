import React from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getAuth } from 'firebase/auth';
import { Button, Grid, Typography } from '@mui/material';

function NotAuthorized() {
  const auth = getAuth();

  return (
    <div className="pageContainer">
      <Grid container direction="column" alignItems="center">
        <Typography
          sx={{ marginTop: 5, marginBottom: 5 }}
          align="center"
          variant="h3"
        >
          NOT AUTHORIZED
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            fetch('/api/logout', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}),
            });
            signOut({ callbackUrl: '/signin' }).then(
              () => {
                auth.signOut();
              },
              function (error) {
                console.log('error', error);
              }
            );
          }}
        >
          SIGN OUT
        </Button>
      </Grid>
    </div>
  );
}

export default NotAuthorized;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let cookies = context.req.cookies;

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  } else if (session && cookies.token != undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
