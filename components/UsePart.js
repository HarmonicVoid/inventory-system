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
  serialNumber: '',
};

function UsePart() {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });
  const { values, setValues, handleInputChange, resetForm, errors, setErrors } =
    InputChange(initialValues);

  const RemoveSerial = async () => {
    console.log('remove serial');
    //Checking to see if serial exists
    const serialData = await partService.CheckSerialNumber(values.serialNumber);
    console.log(serialData);
  };

  const validate = () => {
    let temp = {};
    temp.serialNumber =
      values.serialNumber.length > 9 ? '' : 'This field is required';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == '');
  };

  const Submit = (event) => {
    event.preventDefault();
    if (validate()) {
      RemoveSerial();
    } else {
      const test = validate();
      console.log(test);
    }
  };
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <form onSubmit={Submit} autoComplete="off">
          <TextInput
            variant="filled"
            name="serialNumber"
            value={values.serialNumber}
            onChange={handleInputChange}
            sx={{ width: '100%' }}
            label="Serial Number"
            error={errors.serialNumber}
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />
          <Button sx={{ marginTop: 1 }} type="submit">
            {loading ? 'SUBMITTING...' : 'SUBMIT'}
          </Button>
        </form>
      </Grid>
      <Notifications notify={notify} setNotify={setNotify} />
    </>
  );
}

export default UsePart;
