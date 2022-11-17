import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { modelState } from '../atoms/modelSearchAtom';
import { getSession, signOut, useSession } from 'next-auth/react';
import InventoryTable from '../components/muiComponents/inventoryTable/InventoryTable';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const modelQueried = useRecoilValue(modelState);
  const [modelNames, setModelNames] = useState([]);
  const { data: session, status } = useSession();

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

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
  }, [user]);

  if (session) {
    return (
      <div className="pageContainer">
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
