import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from '../../config/firebase';
import * as partService from '../../services/addPartServices';

const Counter = ({ modelId, partId, partData }) => {
  const singleModelDocRef = doc(db, 'iPhone Models', modelId, 'Parts', partId);
  const docRefModel1 = null;
  const docRefModel2 = null;
  const sharedPartsData = null;

  const IncNum = async () => {
    if (partData.stock == 0) {
    } else if (
      partData.stock > partData.reserved &&
      partData.sharedPartNumber == true
    ) {
      sharedPartsData = await partService.CheckPartNumber(partData.partNumber);

      if (sharedPartsData.length == 2) {
        docRefModel1 = doc(
          db,
          'iPhone Models',
          sharedPartsData[0].modelId,
          'Parts',
          sharedPartsData[0].id
        );

        docRefModel2 = doc(
          db,
          'iPhone Models',
          sharedPartsData[1].modelId,
          'Parts',
          sharedPartsData[1].id
        );
        updateDoc(docRefModel1, {
          reserved: partData.reserved + 1,
          available: partData.available - 1,
        });
        updateDoc(docRefModel2, {
          reserved: partData.reserved + 1,
          available: partData.available - 1,
        });
      }
    } else if (partData.stock > partData.reserved) {
      updateDoc(singleModelDocRef, {
        reserved: partData.reserved + 1,
        available: partData.available - 1,
      });
    }
  };

  //error when decreasing
  const DecNum = async () => {
    const docRef2 = doc(db, 'iPhone Models', modelId, 'Parts', partId);

    if (partData.stock == 0) {
    } else if (partData.stock == partData.reserved) {
      if (partData.sharedPartNumber == true) {
        sharedPartsData = await partService.CheckPartNumber(
          partData.partNumber
        );

        if (sharedPartsData.length == 2) {
          docRefModel1 = doc(
            db,
            'iPhone Models',
            sharedPartsData[0].modelId,
            'Parts',
            sharedPartsData[0].id
          );

          docRefModel2 = doc(
            db,
            'iPhone Models',
            sharedPartsData[1].modelId,
            'Parts',
            sharedPartsData[1].id
          );
          updateDoc(docRefModel1, {
            reserved: partData.reserved - 1,
            available: partData.available + 1,
          });
          updateDoc(docRefModel2, {
            reserved: partData.reserved - 1,
            available: partData.available + 1,
          });
        }
      } else {
        updateDoc(docRef2, {
          reserved: partData.reserved - 1,
          available: partData.available + 1,
        });
      }
    } else if (partData.stock > partData.reserved) {
      if (partData.reserved == 0) {
      } else if (partData.sharedPartNumber == true) {
        sharedPartsData = await partService.CheckPartNumber(
          partData.partNumber
        );

        if (sharedPartsData.length == 2) {
          docRefModel1 = doc(
            db,
            'iPhone Models',
            sharedPartsData[0].modelId,
            'Parts',
            sharedPartsData[0].id
          );

          docRefModel2 = doc(
            db,
            'iPhone Models',
            sharedPartsData[1].modelId,
            'Parts',
            sharedPartsData[1].id
          );
          updateDoc(docRefModel1, {
            reserved: partData.reserved - 1,
            available: partData.available + 1,
          });
          updateDoc(docRefModel2, {
            reserved: partData.reserved - 1,
            available: partData.available + 1,
          });
        }
      } else {
        updateDoc(docRef2, {
          reserved: partData.reserved - 1,
          available: partData.available + 1,
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
        {partData.reserved}
      </Box>

      <Tooltip title="Subtract">
        <Button onClick={DecNum}>
          <RemoveIcon sx={{ color: 'Black', fontSize: '2rem' }} />
        </Button>
      </Tooltip>
    </Box>
  );
};
export default Counter;
