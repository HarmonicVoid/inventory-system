import React from 'react';
import PartsAddedLoggerTable from '../components/muiComponents/loggerTable/LoggerTable';
import PartsUsedLoggerTable from '../components/muiComponents/loggerTable/LoggerTable';
import { getSession, signIn, useSession } from 'next-auth/react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default function Logger() {
  console.log('Logger page rendered');

  return (
    <div className="App">
      <Tabs className="Tabs">
        <TabList>
          <Tab>New Parts Added</Tab>
          <Tab>Parts Used</Tab>
        </TabList>
        <TabPanel>
          <PartsAddedLoggerTable data={[]} />
        </TabPanel>
        <TabPanel>
          <PartsUsedLoggerTable data={[]} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export async function getServerSideProps(context) {
  //console.log(context);
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
