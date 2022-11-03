import React from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import PartForm from '../components/PartForm';
import { Box } from '@mui/material';

export default function AddPart() {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '1000px',
            height: '85%',
          }}
        >
          <PartForm />
        </Box>
      </div>
    );
  }
  return <></>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
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
