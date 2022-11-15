import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { InputChange } from './InputChange';
import Notifications from './muiComponents/Notification';
import TextInput from './muiComponents/TextInput';
import { query, collectionGroup, getDocs, where } from '@firebase/firestore';
import { db } from '/config/firebase';
import * as partService from '../services/addPartServices';
import { useSession } from 'next-auth/react';

const initialValues = {
  serialNumber: '',
};

function UsePart() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });
  const { values, setValues, handleInputChange, resetForm, errors, setErrors } =
    InputChange(initialValues);

  const RemoveSerial = async () => {
    //Checking to see if serial exists

    const querySerialNumbers = query(
      collectionGroup(db, 'Serial Numbers'),
      where('serialNumber', '==', values.serialNumber)
    );
    const serialNumbersDocRef = await getDocs(querySerialNumbers);
    const serialData = serialNumbersDocRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (serialData.length == 0) {
      setNotify({
        isOpen: true,
        message: 'Serial not found',
        type: 'error',
      });
      setLoading(false);
    } else if (serialData.length == 1) {
      await partService.RemoveSerialNumber(
        serialData,
        session.user.name,
        serialNumbersDocRef
      );

      setNotify({
        isOpen: true,
        message: 'Part utilized successfully',
        type: 'success',
      });
      resetForm();
      setLoading(false);
    } else if (serialData.length == 2) {
      await partService.RemoveSerialNumber(
        serialData,
        session.user.name,
        serialNumbersDocRef
      );

      setNotify({
        isOpen: true,
        message: 'Part utilized successfully',
        type: 'success',
      });
      resetForm();
      setLoading(false);
    } else {
      setNotify({
        isOpen: true,
        message: 'Unknown error',
        type: 'error',
      });
      setLoading(false);
    }
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
    setLoading(true);
    event.preventDefault();
    if (validate()) {
      RemoveSerial();
    } else {
      setLoading(false);
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
          <Button
            disabled={loading ? true : false}
            sx={{ marginTop: 1 }}
            type="submit"
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT'}
          </Button>
        </form>
      </Grid>
      <Notifications notify={notify} setNotify={setNotify} />
    </>
  );
}

export default UsePart;
