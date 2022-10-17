import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { modelState } from '../atoms/modelSearchAtom';
import { getSession, signIn, useSession } from 'next-auth/react';
import InventoryTable from '../components/muiComponents/inventoryTable/InventoryTable';
import { Box } from '@mui/material';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Home() {
  const modelQueried = useRecoilValue(modelState);
  const [modelNames, setModelNames] = useState([]);
  const { data: session, status } = useSession();

  React.useEffect(() => {
    return onSnapshot(query(collection(db, 'iPhone Models')), (snapshot) => {
      setModelNames(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);

  if (status === 'authenticated') {
    return (
      <Box
        sx={{
          display: 'grid',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '30px',
          marginBottom: '30px',
        }}
      >
        {modelNames
          .filter((item) =>
            item.model.toLowerCase().includes(modelQueried.toLowerCase())
          )
          .map((item) => (
            <div key={item.id}>
              <InventoryTable
                depend={modelNames}
                model={[item.id, item.model]}
              />
            </div>
          ))}
      </Box>
    );
  }

  return signIn();
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
