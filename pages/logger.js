import React, { useState, useEffect } from 'react';
import PartsAddedLoggerTable from '../components/muiComponents/loggerTable/LoggerTable';
import PartsUsedLoggerTable from '../components/muiComponents/loggerTable/LoggerTable';
import { getSession, signIn, useSession } from 'next-auth/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { db } from '../config/firebase';

export default function Logger() {
  console.log('Logger page rendered');
  const { data: session, status } = useSession();
  const [addedLoggerData, setAddedLoggerData] = useState([]);
  const [utilizedLoggerData, setUtilizedLoggerData] = useState([]);

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
  }, []);

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
  }, []);

  console.log(utilizedLoggerData);

  if (status === 'authenticated') {
    return (
      <div className="TableWrapper">
        <Tabs className="LoggerTable">
          <TabList>
            <Tab>Parts Added</Tab>
            <Tab>Parts Used</Tab>
          </TabList>
          <TabPanel>
            <PartsAddedLoggerTable data={addedLoggerData} />
          </TabPanel>
          <TabPanel>
            <PartsUsedLoggerTable data={utilizedLoggerData} />
          </TabPanel>
        </Tabs>
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
