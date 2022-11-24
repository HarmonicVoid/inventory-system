import React, { useState, useEffect } from 'react';
import PartsAddedLoggerTable from '../components/muiComponents/loggerTable/LoggerTable';
import PartsUsedLoggerTable from '../components/muiComponents/loggerTable/LoggerTable';
import { getSession, signIn, useSession } from 'next-auth/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Logger() {
  const { data: session, status } = useSession();
  const [addedLoggerData, setAddedLoggerData] = useState([]);
  const [utilizedLoggerData, setUtilizedLoggerData] = useState([]);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'Parts Added Logger'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setAddedLoggerData(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      }
    );
  }, [user]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'Parts Used Logger'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setUtilizedLoggerData(
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
        <Tabs className="LoggerTable">
          <TabList>
            <Tab>Parts Added</Tab>
            <Tab>Parts Used</Tab>
          </TabList>
          <TabPanel>
            <PartsAddedLoggerTable data={addedLoggerData} />
          </TabPanel>
          <TabPanel>
            <PartsUsedLoggerTable data={utilizedLoggerData} isUsed={true} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }

  return <></>;
}

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
  } else if (session && cookies.token == undefined) {
    return {
      redirect: {
        destination: '/notAuthorized',
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
