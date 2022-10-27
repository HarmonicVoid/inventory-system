import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { modelState } from '../atoms/modelSearchAtom';
import { getSession, signIn, useSession } from 'next-auth/react';
import InventoryTable from '../components/muiComponents/inventoryTable/InventoryTable';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Home() {
  const modelQueried = useRecoilValue(modelState);
  const [modelNames, setModelNames] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'iPhone Models'), orderBy('model')),
      (snapshot) => {
        setModelNames(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      }
    );
  }, []);

  if (status === 'authenticated') {
    return (
      <div className="TableWrapper">
        <div className="InventoryTable">
          {modelNames

            .filter((item) =>
              item.model.toLowerCase().includes(modelQueried.toLowerCase())
            )
            .map((item) => (
              <InventoryTable key={item.id} model={[item.id, item.model]} />
            ))}
        </div>
      </div>
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
