import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  collectionGroup,
  getDocs,
  where,
} from '@firebase/firestore';
import { db } from '../../config/firebase';

const App = ({
  reservedValue,
  shelfValue,
  modelId,
  partId,
  shared,
  partNumber,
  modelNameShared,
}) => {
  let model1 = [];
  let model2 = [];

  const sharedDocRef = query(
    collection(db, 'Shared Part Numbers'),
    where('partNumber', '==', partNumber)
  );

  const docRef = doc(db, 'iPhone Models', modelId, 'Parts', partId);

  const IncNum = async () => {
    if (shelfValue == 0) {
    } else if (shelfValue > reservedValue && shared.toString() == 'true') {
      const q2 = query(
        collection(db, 'iPhone Models'),
        where('model', '==', modelNameShared[0])
      );

      const queryModel2Snapshot = await getDocs(q2);
      queryModel2Snapshot.forEach((doc) => {
        model1.push({ id: doc.id, ...doc.data() });
      });

      const q3 = query(
        collection(db, 'iPhone Models'),
        where('model', '==', modelNameShared[1])
      );

      const queryModel3Snapshot = await getDocs(q3);
      queryModel3Snapshot.forEach((doc) => {
        model2.push({ id: doc.id, ...doc.data() });
      });

      const serialQuery = query(
        collectionGroup(db, 'Parts'),
        where('partNumber', '==', partNumber)
      );
      const queryPartNumber = await getDocs(serialQuery);

      const partsData = queryPartNumber.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const docRefModel1 = doc(
        db,
        'iPhone Models',
        model1[0].id,
        'Parts',
        partsData[0].id
      );
      const docRefModel2 = doc(
        db,
        'iPhone Models',
        model2[0].id,
        'Parts',
        partsData[1].id
      );

      updateDoc(docRefModel1, {
        reserved: reservedValue + 1,
      });
      updateDoc(docRefModel2, {
        reserved: reservedValue + 1,
      });
    } else if (shelfValue > reservedValue) {
      updateDoc(docRef, {
        reserved: reservedValue + 1,
      });
    }
  };

  const DecNum = async () => {
    const docRef2 = doc(db, 'iPhone Models', modelId, 'Parts', partId);

    if (shelfValue == 0) {
    } else if (shelfValue == reservedValue) {
      if (shared.toString() == 'true') {
        const q2 = query(
          collection(db, 'iPhone Models'),
          where('model', '==', modelNameShared[0])
        );

        const queryModel2Snapshot = await getDocs(q2);
        queryModel2Snapshot.forEach((doc) => {
          model1.push({ id: doc.id, ...doc.data() });
        });

        const q3 = query(
          collection(db, 'iPhone Models'),
          where('model', '==', modelNameShared[1])
        );

        const queryModel3Snapshot = await getDocs(q3);
        queryModel3Snapshot.forEach((doc) => {
          model2.push({ id: doc.id, ...doc.data() });
        });

        const serialQuery = query(
          collectionGroup(db, 'Parts'),
          where('partNumber', '==', partNumber)
        );
        const queryPartNumber = await getDocs(serialQuery);

        const partsData = queryPartNumber.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const docRefModel1 = doc(
          db,
          'iPhone Models',
          model1[0].id,
          'Parts',
          partsData[0].id
        );
        const docRefModel2 = doc(
          db,
          'iPhone Models',
          model2[0].id,
          'Parts',
          partsData[1].id
        );

        updateDoc(docRefModel1, {
          reserved: reservedValue - 1,
        });
        updateDoc(docRefModel2, {
          reserved: reservedValue - 1,
        });
      } else {
        updateDoc(docRef2, {
          reserved: reservedValue - 1,
        });
      }
    } else if (shelfValue > reservedValue) {
      if (reservedValue == 0) {
      } else if (shared.toString() == 'true') {
        const q2 = query(
          collection(db, 'iPhone Models'),
          where('model', '==', modelNameShared[0])
        );

        const queryModel2Snapshot = await getDocs(q2);
        queryModel2Snapshot.forEach((doc) => {
          model1.push({ id: doc.id, ...doc.data() });
        });

        const q3 = query(
          collection(db, 'iPhone Models'),
          where('model', '==', modelNameShared[1])
        );

        const queryModel3Snapshot = await getDocs(q3);
        queryModel3Snapshot.forEach((doc) => {
          model2.push({ id: doc.id, ...doc.data() });
        });

        const serialQuery = query(
          collectionGroup(db, 'Parts'),
          where('partNumber', '==', partNumber)
        );
        const queryPartNumber = await getDocs(serialQuery);

        const partsData = queryPartNumber.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const docRefModel1 = doc(
          db,
          'iPhone Models',
          model1[0].id,
          'Parts',
          partsData[0].id
        );
        const docRefModel2 = doc(
          db,
          'iPhone Models',
          model2[0].id,
          'Parts',
          partsData[1].id
        );

        updateDoc(docRefModel1, {
          reserved: reservedValue - 1,
        });
        updateDoc(docRefModel2, {
          reserved: reservedValue - 1,
        });
      } else {
        updateDoc(docRef2, {
          reserved: reservedValue - 1,
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip title="Add">
        <Button onClick={IncNum}>
          <AddIcon sx={{ color: 'Black', fontSize: '2rem' }} />
        </Button>
      </Tooltip>
      <Box sx={{ marginLeft: '10px', marginRight: '10px' }}>
        {reservedValue}
      </Box>

      <Tooltip title="Subtract">
        <Button onClick={DecNum}>
          <RemoveIcon sx={{ color: 'Black', fontSize: '2rem' }} />
        </Button>
      </Tooltip>
    </Box>
  );
};
export default App;
