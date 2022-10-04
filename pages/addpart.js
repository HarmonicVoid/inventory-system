import React from 'react';
import { getSession } from 'next-auth/react';
import PartForm from '../components/PartForm';
import { Box } from '@mui/material';

export default function addpart() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
      }}
    >
      <PartForm />
    </Box>
  );
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
