import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { InputChange } from './InputChange';
import Notifications from './muiComponents/Notification';
import TextInput from './muiComponents/TextInput';
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
  deleteDoc,
  docs,
  where,
} from '@firebase/firestore';
import { db } from '/config/firebase';

const initialValues = {
  partNumber: '',
  serialNumber: '',
};

function UsePart() {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });
  const { values, setValues, handleInputChange, resetForm } =
    InputChange(initialValues);

  const Submit = (event) => {
    event.preventDefault();
    // if (validate()) {
    //   console.log('true');
    //   AddPart();
    // } else {
    //   const test = validate();
    //   console.log(test);
    // }
  };
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        rowSpacing={3}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 3,
          }}
        >
          {/* <TextInput
            name="partNumber"
            value={values.partNumber}
            onChange={handleInputChange}
            label="Part Number"
            sx={{
              marginRight: 2,
              width: '100%',
            }}
          /> */}

          <form onSubmit={Submit} autoComplete="off">
            <TextInput
              variant="filled"
              name="serialNumber"
              value={values.serialNumber}
              onChange={handleInputChange}
              sx={{ width: '100%' }}
              label="Serial Number"
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
            <Button sx={{ marginTop: 1 }} type="submit">
              {loading ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </form>
        </Box>
      </Grid>
      <Notifications notify={notify} setNotify={setNotify} />
    </>
  );
}

export default UsePart;
