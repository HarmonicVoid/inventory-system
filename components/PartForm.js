import React, { useEffect, useState } from 'react';
import MultiSelect from './muiComponents/MultiSelect';
import Select from './muiComponents/Select';
import { Box, Grid, Typography, Fab, Card, CardContent } from '@mui/material';
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
} from '@firebase/firestore';
import { db } from '../config/firebase';
import { InputChange } from './InputChange';
import TextInput from './muiComponents/TextInput';
import Popup from './muiComponents/Popup';
import { useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import Notifications from './muiComponents/Notification';
import * as partService from '../services/addPartServices';

const initialValues = {
  modelId: '',
  partId: '',
  deviceModel: '',
  partNumber: '',
  serialNumber: '',
  deliveryNumber: '',
  modelName: '',
};

function PartForm() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [modelsMenu, setModelsMenu] = useState([]);
  const [partsMenu, setPartsMenu] = useState([]);
  const [openUsePopup, setOpenUsePopup] = useState(false);
  const [openModelsPopup, setModelsOpenPopup] = useState(false);
  const [modelSelection, setModelSelection] = React.useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const handleModelChange = (event) => {
    const {
      target: { value },
    } = event;
    setModelSelection(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [modelName, setModelName] = useState('');

  const handleChange = (e) => {
    setModelName(e.target.value.toUpperCase());
  };

  const [partName, setPartName] = useState('');

  const handlePartNameChange = (e) => {
    setPartName(e.target.value.toUpperCase());
  };

  const { values, setValues, handleInputChange, resetForm, errors, setErrors } =
    InputChange(initialValues);

  useEffect(() => {
    onSnapshot(query(collection(db, 'modelsSelection')), (snapshot) => {
      setModelsMenu(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);

  useEffect(() => {
    onSnapshot(query(collection(db, 'partsSelection')), (snapshot) => {
      setPartsMenu(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);

  const validateModelPopup = () => {
    let temp = {};
    temp.modelName = /^IPHONE [0-9A-Z]{1,5} ?[A-Z0-9]* ?[A-Z]*$/.test(modelName)
      ? ''
      : 'Must contain iPhone and model name';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == '');
  };

  const validatePartNamePopup = () => {
    let temp = {};
    temp.partName = partName.length > 3 ? '' : 'Must be a valid name';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == '');
  };

  const addModelName = async () => {
    setLoading(true);
    if (validateModelPopup()) {
      await addDoc(collection(db, 'modelsSelection'), {
        title: modelName,
        timestamp: serverTimestamp(),
        user: session.user.name,
      });

      setModelName('');
      setLoading(false);
      setModelsOpenPopup(false);
    } else {
      setLoading(false);
    }
  };

  const addPartName = async () => {
    setLoading(true);

    if (validatePartNamePopup()) {
      await addDoc(collection(db, 'partsSelection'), {
        title: partName,
        timestamp: serverTimestamp(),
        user: session.user.name,
      });

      setPartName('');
      setLoading(false);
      setOpenUsePopup(false);
    } else {
      setLoading(false);
    }
  };

  const UploadMultipleModelsParts = async () => {
    const partNameDataModel1 = [];
    const partNameDataModel2 = [];

    const model1 = await partService.CheckModelInDb(modelSelection[0]);
    const model2 = await partService.CheckModelInDb(modelSelection[1]);

    if (model1.length != 0) {
      partNameDataModel1 = await partService.CheckPartName(
        model1[0].id,
        values.partId
      );
    }
    if (model2.length != 0) {
      partNameDataModel2 = await partService.CheckPartName(
        model2[0].id,
        values.partId
      );
    }

    if (model1.length == 0 && model2.length == 0) {
      //Creates new models and new parts that do not exist

      const partNumberData = await partService.CheckPartNumber(
        values.partNumber
      );
      if (partNumberData.length >= 1) {
        setNotify({
          isOpen: true,
          message: 'Part number already exist',
          type: 'error',
        });
        setLoading(false);
      } else if (partNumberData.length == 0) {
        //creating new models with new serial and adding serial already in DB

        for (let i = 0; i < modelSelection.length; i++) {
          const newModelRef = await partService.CreateNewModel(
            modelSelection[i]
          );

          const newPartModelDocRef = await partService.CreateNewPart(
            values.partId,
            values.partNumber,
            [modelSelection[0], modelSelection[1]],
            newModelRef.id
          );

          await partService.AddSerial(
            newModelRef.id,
            newPartModelDocRef.id,
            values.deliveryNumber,
            session.user.name,
            values.serialNumber,
            values.partId,
            values.partNumber,
            [modelSelection[0], modelSelection[1]]
          );

          await partService.UpdateStock(
            newModelRef.id,
            newPartModelDocRef.id,
            values.partNumber
          );

          if (i == 1) {
            if (setLoading != false) {
              setNotify({
                isOpen: true,
                message: 'Shared parts added successfully',
                type: 'success',
              });

              resetForm();
              setModelSelection([]);
              setLoading(false);
            }
          }
        }
      }
    } else if (
      (model1.length != 0 &&
        model2.length != 0 &&
        partNameDataModel1.length != 0 &&
        partNameDataModel2.length == 0) ||
      (model1.length != 0 &&
        model2.length != 0 &&
        partNameDataModel1.length == 0 &&
        partNameDataModel2.length != 0)
    ) {
      setNotify({
        isOpen: true,
        message: 'Part selected is already associated with one of the models',
        type: 'error',
      });
      setLoading(false);
    } else if (
      model1.length != 0 &&
      model2.length != 0 &&
      partNameDataModel1.length == 0 &&
      partNameDataModel2.length == 0
    ) {
      const partNumberData = await partService.CheckPartNumber(
        values.partNumber
      );
      if (partNumberData.length >= 1) {
        setNotify({
          isOpen: true,
          message: 'Part number already exist',
          type: 'error',
        });
        setLoading(false);
      } else if (partNumberData.length == 0) {
        for (let i = 0; i < modelSelection.length; i++) {
          const model = await partService.CheckModelInDb(modelSelection[i]);
          const newPartModelDocRef = await partService.CreateNewPart(
            values.partId,
            values.partNumber,
            [modelSelection[0], modelSelection[1]],
            model[0].id
          );

          await partService.AddSerial(
            model[0].id,
            newPartModelDocRef.id,
            values.deliveryNumber,
            session.user.name,
            values.serialNumber,
            values.partId,
            values.partNumber,
            [modelSelection[0], modelSelection[1]]
          );

          await partService.UpdateStock(
            model[0].id,
            newPartModelDocRef.id,
            values.partNumber
          );

          if (i == 1) {
            if (setLoading != false) {
              setNotify({
                isOpen: true,
                message: 'Added successfully!',
                type: 'success',
              });

              resetForm();
              setModelSelection([]);
              setLoading(false);
            }
          }
        }
      }
    } else if (
      model1.length != 0 &&
      model2.length != 0 &&
      partNameDataModel1.length != 0 &&
      partNameDataModel2.length != 0
    ) {
      if (
        partNameDataModel1[0].sharedPartNumber == true &&
        partNameDataModel2[0].sharedPartNumber == true
      ) {
        //Adds one to the part stock for both models
        for (let i = 0; i < modelSelection.length; i++) {
          const model = await partService.CheckModelInDb(modelSelection[i]);
          const partNameDataMode = await partService.CheckPartName(
            model[0].id,
            values.partId
          );

          if (values.partNumber != partNameDataMode[0].partNumber) {
            setNotify({
              isOpen: true,
              message: 'Part number does not match',
              type: 'error',
            });
            setLoading(false);
          } else if (values.partNumber == partNameDataMode[0].partNumber) {
            //adding serial for model1 part
            await partService.AddSerial(
              model[0].id,
              partNameDataMode[0].id,
              values.deliveryNumber,
              session.user.name,
              values.serialNumber,
              values.partId,
              values.partNumber,
              [modelSelection[0], modelSelection[1]]
            );

            await partService.UpdateStock(
              model[0].id,
              partNameDataMode[0].id,
              values.partNumber
            );

            if (i == 1) {
              if (setLoading != false) {
                setNotify({
                  isOpen: true,
                  message: 'Added successfully!',
                  type: 'success',
                });

                resetForm();
                setModelSelection([]);
                setLoading(false);
              }
            }
          }
        }
      } else if (partNameDataModel1[0].sharedPartNumber == false) {
        setNotify({
          isOpen: true,
          message:
            modelSelection[0] +
            ' already has ' +
            values.partId +
            ' part as a single, not shared.',
          type: 'error',
        });
        setLoading(false);
      } else if (partNameDataModel2[0].sharedPartNumber == false) {
        setNotify({
          isOpen: true,
          message:
            modelSelection[1] +
            ' already has ' +
            values.partId +
            ' part as a single, not shared.',
          type: 'error',
        });
        setLoading(false);
      } else {
        setNotify({
          isOpen: true,
          message: 'Unknown error',
          type: 'error',
        });
        setLoading(false);
      }
    }

    if (
      (model1.length != 0 &&
        model2.length == 0 &&
        partNameDataModel1.length != 0 &&
        partNameDataModel2 == 0) ||
      (model2.length != 0 &&
        model1.length == 0 &&
        partNameDataModel1.length == 0 &&
        partNameDataModel2 != 0)
    ) {
      setNotify({
        isOpen: true,
        message: 'Part should not exist in both models',
        type: 'error',
      });
      setLoading(false);
    } else if (
      (model1.length != 0 &&
        model2.length == 0 &&
        partNameDataModel1.length == 0 &&
        partNameDataModel2 == 0) ||
      (model2.length != 0 &&
        model1.length == 0 &&
        partNameDataModel1.length == 0 &&
        partNameDataModel2 == 0)
    ) {
      const partNumberData = await partService.CheckPartNumber(
        values.partNumber
      );

      if (partNumberData.length != 0) {
        setNotify({
          isOpen: true,
          message: 'Part number already exists',
          type: 'error',
        });
        setLoading(false);
      } else if (partNumberData.length == 0) {
        const model = [];
        const newModel1Ref = null;
        const newModel2Ref = null;

        if (model2.length == 0) {
          newModel2Ref = await partService.CreateNewModel(modelSelection[1]);
        } else if (model1.length == 0) {
          newModel1Ref = await partService.CreateNewModel(modelSelection[0]);
        }

        for (let i = 0; i < modelSelection.length; i++) {
          model = await partService.CheckModelInDb(modelSelection[i]);

          const newPartModelDocRef = await partService.CreateNewPart(
            values.partId,
            values.partNumber,
            [modelSelection[0], modelSelection[1]],
            model[0].id
          );

          //adding serial for model1 part
          await partService.AddSerial(
            model[0].id,
            newPartModelDocRef.id,
            values.deliveryNumber,
            session.user.name,
            values.serialNumber,
            values.partId,
            values.partNumber,
            [modelSelection[0], modelSelection[1]]
          );

          await partService.UpdateStock(
            model[0].id,
            newPartModelDocRef.id,
            values.partNumber
          );

          if (i == 1) {
            if (setLoading != false) {
              setNotify({
                isOpen: true,
                message: 'Added successfully',
                type: 'success',
              });

              resetForm();
              setModelSelection([]);
              setLoading(false);
            }
          }
        }
      } else {
        setNotify({
          isOpen: true,
          message: 'Unknown error',
          type: 'error',
        });
        setLoading(false);
      }
    }
  };

  const AddPart = async () => {
    let isOnlyOne = null;
    const modelDb = null;

    const serialData = await partService.CheckSerialNumber(values.serialNumber);

    if (modelSelection.length >= 3) {
      setNotify({
        isOpen: true,
        message: 'Too many models selected',
        type: 'error',
      });

      setLoading(false);
    } else if (modelSelection.length == 2 && serialData.length <= 0) {
      UploadMultipleModelsParts();
    } else if (modelSelection.length == 1 && serialData.length <= 0) {
      isOnlyOne = true;
    } else {
      setNotify({
        isOpen: true,
        message: 'Serial number already exists',
        type: 'error',
      });

      setLoading(false);
    }

    //Checking DB for model and storing in variable
    modelDb = await partService.CheckModelInDb(modelSelection[0]);

    if (modelDb.length == 0 && isOnlyOne == true) {
      //iPhone model does not exist
      //Checking to see if part number is in db
      const partNumberData = await partService.CheckPartNumber(
        values.partNumber
      );

      if (partNumberData.length != 0) {
        setNotify({
          isOpen: true,
          message: 'Part number already exists',
          type: 'error',
        });
        setLoading(false);
      } else {
        // Part number not in DB. Will create new model, part, add serial with logging, and update stock

        const newModelDocRef = await partService.CreateNewModel(
          modelSelection[0]
        );

        const newPartDocRef = await partService.CreateNewPart(
          values.partId,
          values.partNumber,
          [modelSelection[0]],
          newModelDocRef.id
        );

        await partService.AddSerial(
          newModelDocRef.id,
          newPartDocRef.id,
          values.deliveryNumber,
          session.user.name,
          values.serialNumber,
          values.partId,
          values.partNumber,
          [modelSelection[0]]
        );

        await partService.UpdateStock(
          newModelDocRef.id,
          newPartDocRef.id,
          values.partNumber
        );

        setNotify({
          isOpen: true,
          message: 'Added successfully',
          type: 'success',
        });

        resetForm();
        setModelSelection([]);
        setLoading(false);
      }
    } else if (modelDb.length != 0 && isOnlyOne == true) {
      //iPhone model is in DB

      const partNameData = await partService.CheckPartName(
        modelDb[0].id,
        values.partId
      );

      if (
        partNameData.length != 0 &&
        partNameData[0].partName == values.partId
      ) {
        //Part name selected exists in DB

        //Checks to see if part number entered matches with part number in DB
        if (partNameData[0].partNumber == values.partNumber) {
          //Part number entered matches with DB

          const partSharedStatus = await partService.CheckSharedPartStatus(
            modelDb[0].id,
            partNameData[0].id
          );

          if (partSharedStatus == true) {
            setNotify({
              isOpen: true,
              message:
                modelSelection[0] +
                ' is already sharing the part ' +
                values.partId,
              type: 'error',
            });

            setLoading(false);
          } else {
            await partService.AddSerial(
              modelDb[0].id,
              partNameData[0].id,
              values.deliveryNumber,
              session.user.name,
              values.serialNumber,
              values.partId,
              values.partNumber,
              [modelSelection[0]]
            );

            await partService.UpdateStock(
              modelDb[0].id,
              partNameData[0].id,
              values.partNumber
            );

            setNotify({
              isOpen: true,
              message: 'Added successfully',
              type: 'success',
            });

            resetForm();
            setModelSelection([]);
            setLoading(false);
          }
        } else {
          setNotify({
            isOpen: true,
            message: 'Part number does not match',
            type: 'error',
          });

          setLoading(false);
        }
      } else {
        //Part name does not exist in DB

        const partNumberData = await partService.CheckPartNumber(
          values.partNumber
        );

        if (partNumberData.length != 0) {
          setNotify({
            isOpen: true,
            message: 'Part number already exist',
            type: 'error',
          });
          setLoading(false);
        } else {
          const newPartDocRef = await partService.CreateNewPart(
            values.partId,
            values.partNumber,
            [modelSelection[0]],
            modelDb[0].id
          );

          await partService.AddSerial(
            modelDb[0].id,
            newPartDocRef.id,
            values.deliveryNumber,
            session.user.name,
            values.serialNumber,
            values.partId,
            values.partNumber,
            [modelSelection[0]]
          );

          await partService.UpdateStock(
            modelDb[0].id,
            newPartDocRef.id,
            values.partNumber
          );

          setNotify({
            isOpen: true,
            message: 'Added successfully',
            type: 'success',
          });

          resetForm();
          setModelSelection([]);
          setLoading(false);
        }
      }
    }
  };

  const validate = () => {
    let temp = {};
    temp.multiId = modelSelection.length > 0 ? '' : 'This field is required';
    temp.partId = values.partId ? '' : 'This field is required';
    temp.partNumber = /^\d{3}-\d{5}$/.test(values.partNumber)
      ? ''
      : 'Must be a part number';
    temp.serialNumber = /^[A-Z0-9]{10,17}$/.test(values.serialNumber)
      ? ''
      : 'Must be a valid serial number';
    temp.deliveryNumber =
      /^[0-9]*$/.test(values.deliveryNumber) &&
      values.deliveryNumber.length == 10
        ? ''
        : 'Must be a valid delivery number';

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == '');
  };

  const Submit = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (validate()) {
      AddPart();
    } else {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '90%',
      }}
    >
      <Card sx={{ width: '70%', height: '80%' }} elevation={5}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            marginBottom: 10,
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant="h4">
            Part Information
          </Typography>
        </Box>
        <CardContent>
          <form onSubmit={Submit} autoComplete="off">
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                }}
              >
                <MultiSelect
                  label="Models"
                  value={modelSelection}
                  onChange={handleModelChange}
                  options={modelsMenu}
                  error={errors.multiId}
                  name="multiId"
                />

                <Button
                  onClick={() => {
                    setModelsOpenPopup(true);
                  }}
                  sx={{ marginLeft: 1 }}
                >
                  NEW
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                  marginTop: 2,
                }}
              >
                <Select
                  name="partId"
                  label="Parts"
                  value={values.partId}
                  onChange={handleInputChange}
                  options={partsMenu}
                  error={errors.partId}
                />
                <Button
                  onClick={() => {
                    setOpenUsePopup(true);
                  }}
                  sx={{ marginLeft: 1 }}
                >
                  NEW
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                  marginTop: 2,
                }}
              >
                <TextInput
                  name="serialNumber"
                  value={values.serialNumber}
                  onChange={handleInputChange}
                  sx={{ width: '100%' }}
                  label="Serial Number"
                  error={errors.serialNumber}
                  inputProps={{
                    style: { textTransform: 'uppercase' },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '80%',
                  marginTop: 2,
                }}
              >
                <TextInput
                  name="partNumber"
                  value={values.partNumber}
                  onChange={handleInputChange}
                  label="Part Number"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                  error={errors.partNumber}
                  sx={{
                    marginRight: 2,
                    width: '100%',
                    color: 'white',
                    '&:multilineColor': {
                      color: 'red',
                    },
                  }}
                />

                <TextInput
                  name="deliveryNumber"
                  value={values.deliveryNumber}
                  onChange={handleInputChange}
                  sx={{ width: '100%' }}
                  label="Delivery Number"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                  error={errors.deliveryNumber}
                />
              </Box>

              <Box
                sx={{
                  width: '80%',
                  marginTop: '20px',
                }}
              >
                <Button
                  disabled={loading ? true : false}
                  variant="contained"
                  type="submit"
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </Box>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Popup
        title="Enter Part"
        openPopup={openUsePopup}
        setOpenPopup={setOpenUsePopup}
      >
        <TextInput
          name="partName"
          value={partName}
          onChange={handlePartNameChange}
          sx={{ width: '100%', marginTop: 1, marginBottom: 1 }}
          error={errors.partName}
          label="Name"
          autoComplete="off"
        />
        <Button disabled={loading ? true : false} onClick={() => addPartName()}>
          {loading ? 'SUBMITTING...' : 'ADD'}
        </Button>
      </Popup>
      <Popup
        title="Enter Model"
        openPopup={openModelsPopup}
        setOpenPopup={setModelsOpenPopup}
      >
        <TextInput
          name="modelName"
          value={modelName}
          onChange={handleChange}
          sx={{ width: '100%', marginTop: 1, marginBottom: 1 }}
          error={errors.modelName}
          label="Name"
          autoComplete="off"
        />
        <Button
          disabled={loading ? true : false}
          onClick={() => addModelName()}
        >
          {loading ? 'SUBMITTING...' : 'ADD'}
        </Button>
      </Popup>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
}

export default PartForm;
