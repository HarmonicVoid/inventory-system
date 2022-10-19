import React, { useEffect, useState, useRef } from 'react';
import MultiSelect from './muiComponents/MultiSelect';
import Select from './muiComponents/Select';
import { Box, Grid, Typography, Fab, Card, CardContent } from '@mui/material';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  collectionGroup,
  getDocs,
  where,
  docs,
  deleteDoc,
} from '@firebase/firestore';
import { db } from '../config/firebase';
import { InputChange } from './InputChange';
import TextInput from './muiComponents/TextInput';
import Popup from './muiComponents/Popup';
import { useSession } from 'next-auth/react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Notifications from './muiComponents/Notification';
import { EventAvailable, SellOutlined } from '@mui/icons-material';
import * as partService from '../services/addPartServices';

const initialValues = {
  modelId: '',
  partId: '',
  modelName: '',
  partName: '',
  deviceModel: '',
  partNumber: '',
  serialNumber: '',
  deliveryNumber: '',
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

  const router = useRouter();

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

  const addModelName = async () => {
    if (loading) return;
    setLoading(true);

    console.log(values.modelName);

    await addDoc(collection(db, 'modelsSelection'), {
      title: values.modelName.toUpperCase(),
      timestamp: serverTimestamp(),
      user: session.user.name,
    });

    console.log('new model added: ' + values.modelName);

    resetForm();
    setLoading(false);
    setModelsOpenPopup(false);
  };

  const addPartName = async () => {
    setLoading(true);

    console.log(values.partName);

    await addDoc(collection(db, 'partsSelection'), {
      title: values.partName.toUpperCase(),
      timestamp: serverTimestamp(),
      user: session.user.name,
    });

    console.log('new part added: ' + values.partName);

    resetForm();
    setLoading(false);
    setOpenUsePopup(false);
  };

  //Multi Model----------------------------------------------------

  const UploadMultipleModelsParts = async () => {
    let model1 = [];
    let model2 = [];
    let model1InDb = null;
    let model2InDb = null;
    let model1PartNameExist = null;
    let model2PartNameExist = null;
    let model1SharedParts = null;
    let model2SharedParts = null;
    let newModel1Ref = null;
    let newModel2Ref = null;
    let sharedSerialsArray = [];
    const partDataModel1 = null;
    const partDataModel2 = null;
    let singlePartModel1 = false;
    let singlePartModel2 = false;

    // This will give an array of the model 1's parts to confirm if model is in DB

    console.log('Checking ' + modelSelection[0]);

    const q1 = query(
      collection(db, 'iPhone Models'),
      where('model', '==', modelSelection[0])
    );

    const queryModel1Snapshot = await getDocs(q1);
    queryModel1Snapshot.forEach((doc) => {
      model1.push({ id: doc.id, ...doc.data() });
    });

    console.log(model1);

    if (model1.length == 0) {
      console.log('iPhone model does not exist');
      model1InDb = false;
    } else if (model1.length != 0) {
      model1InDb = true;
    }

    // This will give an array of the model 2's parts to confirm if model is in DB

    console.log('Checking ' + modelSelection[1]);

    const q2 = query(
      collection(db, 'iPhone Models'),
      where('model', '==', modelSelection[1])
    );

    const queryModel2Snapshot = await getDocs(q2);
    queryModel2Snapshot.forEach((doc) => {
      model2.push({ id: doc.id, ...doc.data() });
    });

    console.log(model2);

    if (model2.length == 0) {
      console.log('iPhone model does not exist');
      model2InDb = false;
    } else if (model2.length != 0) {
      model2InDb = true;
    }

    //Checking to see if partnumber already exists in model1/MODEL2 and matches with part name selected

    if (model1InDb == true) {
      console.log('iPhone model1 is in DB');

      const partDataRef = query(
        collection(db, 'iPhone Models', model1[0].id, 'Parts'),
        where('partName', '==', values.partId)
      );

      const queryPartData = await getDocs(partDataRef);
      partDataModel1 = queryPartData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (partDataModel1.length <= 0) {
        model1PartNameExist = false;
        console.log('Part does not exist: ' + model1PartNameExist);
      } else {
        model1PartNameExist = true;

        // If found, checking to see if part# matches with user typed part#
        console.log('Part number: ' + partDataModel1[0].partNumber);

        if (partDataModel1[0].sharedPartNumber == false) {
          setNotify({
            isOpen: true,
            message:
              modelSelection[0] +
              ' already has the ' +
              values.partId +
              ' as a single part, not shared ',
            type: 'error',
          });
          singlePartModel1 = true;
          setLoading(false);
        } else if (values.partNumber != partDataModel1[0].partNumber) {
          setNotify({
            isOpen: true,
            message: 'Part number does not match',
            type: 'error',
          });
          setLoading(false);
        } else if (
          values.partNumber == partDataModel1[0].partNumber &&
          partDataModel1[0].sharedPartNumber == true
        ) {
          model1SharedParts = true;
        }
      }
    }

    if (model2InDb == true) {
      console.log('iPhone model2 is in DB');

      const partDataRef = query(
        collection(db, 'iPhone Models', model2[0].id, 'Parts'),
        where('partName', '==', values.partId)
      );

      const queryPartData = await getDocs(partDataRef);
      partDataModel2 = queryPartData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (partDataModel2.length <= 0) {
        model2PartNameExist = false;
        console.log('Part does not exist: ' + model1PartNameExist);
      } else {
        model2PartNameExist = true;
        // If found, checking to see if part# matches with user typed part#
        console.log('Part number: ' + partDataModel2[0].partNumber);

        if (partDataModel2[0].sharedPartNumber == false) {
          setNotify({
            isOpen: true,
            message:
              modelSelection[1] +
              ' already has the ' +
              values.partId +
              'as a single part, not shared ',
            type: 'error',
          });
          singlePartModel2 = true;
          setLoading(false);
        } else if (values.partNumber != partDataModel2[0].partNumber) {
          setNotify({
            isOpen: true,
            message: 'Part number does not match',
            type: 'error',
          });
          setLoading(false);
        } else if (
          values.partNumber == partDataModel2[0].partNumber &&
          partDataModel2[0].sharedPartNumber == true
        ) {
          model2SharedParts = true;
        }
      }
    }

    if (model1InDb == false && model2InDb == false) {
      //Creates new models and new parts do not exist

      //Looking for duplicate part#'s
      const partNumberQuery = query(
        collectionGroup(db, 'Parts'),
        where('partNumber', '==', values.partNumber)
      );
      const queryPartNumbers = await getDocs(partNumberQuery);

      const partNumberData = queryPartNumbers.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Part number in DB?');

      console.log(partNumberData);

      if (partNumberData.length == 0) {
        const partNumberDocRef = query(
          collectionGroup(db, 'Serial Numbers'),
          where('partNumber', '==', values.partNumber)
        );
        const queryPartNumber = await getDocs(partNumberDocRef);

        const serialData = queryPartNumber.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(serialData);

        //creating new models with new serial and adding serial already in DB

        newModel1Ref = await addDoc(collection(db, 'iPhone Models'), {
          model: modelSelection[0],
        });

        newModel2Ref = await addDoc(collection(db, 'iPhone Models'), {
          model: modelSelection[1],
        });

        const newPartRef = await addDoc(collection(db, 'Shared Part Numbers'), {
          partNumber: values.partNumber,
          partName: values.partId,
          model: [modelSelection[0], modelSelection[1]],
        });

        await addDoc(
          collection(
            db,
            'Shared Part Numbers',
            newPartRef.id,
            'Serial Numbers'
          ),
          {
            timestamp: serverTimestamp(),
            deliveryNumber: values.deliveryNumber,
            user: session.user.name,
            serialNumber: values.serialNumber.toUpperCase(),
            partName: values.partId,
            partNumber: values.partNumber,
            model: [modelSelection[0], modelSelection[1]],
          }
        );

        //getting stock(number of serials) from shared part number

        const subCollectionSnapshot = await getDocs(
          collection(db, 'Shared Part Numbers', newPartRef.id, 'Serial Numbers')
        );
        subCollectionSnapshot.forEach((docs) => {
          sharedSerialsArray.push(docs.data());
        });

        //setting stock and part info for  model1

        await addDoc(
          collection(db, 'iPhone Models', newModel1Ref.id, 'Parts'),
          {
            partNumber: values.partNumber,
            model: [modelSelection[0], modelSelection[1]],
            stock: sharedSerialsArray.length,
            reserved: 0,
            sharedPartNumber: true,
            available: sharedSerialsArray.length,
            partName: values.partId,
          }
        );

        //setting stock and part info for  model2

        await addDoc(
          collection(db, 'iPhone Models', newModel2Ref.id, 'Parts'),
          {
            partNumber: values.partNumber,
            model: [modelSelection[0], modelSelection[1]],
            stock: sharedSerialsArray.length,
            reserved: 0,
            sharedPartNumber: true,
            available: sharedSerialsArray.length,
            partName: values.partId,
          }
        );

        //logger

        await addDoc(collection(db, 'Parts Added Logger'), {
          timestamp: serverTimestamp(),
          deliveryNumber: values.deliveryNumber,
          addedBy: session.user.name,
          serialNumber: values.serialNumber,
          partName: values.partId,
          partNumber: values.partNumber,
          model: [modelSelection[0], modelSelection[1]],
        });

        setNotify({
          isOpen: true,
          message: 'Added successfully',
          type: 'success',
        });

        setLoading(false);
      } else if (partNumberData.length >= 1) {
        setNotify({
          isOpen: true,
          message: 'Part number already exist',
          type: 'error',
        });
      }

      setLoading(false);
    } else if (
      model1InDb == true &&
      model2InDb == true &&
      model1SharedParts == true &&
      model2SharedParts == true
    ) {
      console.log('Both models exist with part already being shared');
      // console.log(partDataModel1);
      // console.log(partDataModel2);

      const q1 = query(
        collection(db, 'Shared Part Numbers'),
        where('partNumber', '==', values.partNumber)
      );

      const queryModel1Snapshot = await getDocs(q1);

      const partSharedNumberData = queryModel1Snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(modelSelection);

      //Adding new serial

      await addDoc(
        collection(
          db,
          'Shared Part Numbers',
          partSharedNumberData[0].id,
          'Serial Numbers'
        ),
        {
          timestamp: serverTimestamp(),
          deliveryNumber: values.deliveryNumber,
          user: session.user.name,
          serialNumber: values.serialNumber,
          partName: values.partId,
          partNumber: values.partNumber,
          model: [modelSelection[0], modelSelection[1]],
        }
      );

      //updating the stock.

      const subCollectionSnapshot = await getDocs(
        collection(
          db,
          'Shared Part Numbers',
          partSharedNumberData[0].id,
          'Serial Numbers'
        )
      );
      subCollectionSnapshot.forEach((docs) => {
        sharedSerialsArray.push(docs.data());
      });

      await updateDoc(
        doc(db, 'iPhone Models', model1[0].id, 'Parts', partDataModel1[0].id),
        {
          stock: sharedSerialsArray.length,
          available: sharedSerialsArray.length,
        }
      );
      await updateDoc(
        doc(db, 'iPhone Models', model2[0].id, 'Parts', partDataModel2[0].id),
        {
          stock: sharedSerialsArray.length,
          available: sharedSerialsArray.length,
        }
      );

      //logger

      await addDoc(collection(db, 'Parts Added Logger'), {
        timestamp: serverTimestamp(),
        deliveryNumber: values.deliveryNumber,
        addedBy: session.user.name,
        serialNumber: values.serialNumber,
        partName: values.partId,
        partNumber: values.partNumber,
        model: [modelSelection[0], modelSelection[1]],
      });

      setNotify({
        isOpen: true,
        message: 'Added successfully',
        type: 'success',
      });

      setLoading(false);
    } else if (
      model1InDb == true &&
      model2InDb == true &&
      model1PartNameExist == false &&
      model2PartNameExist == false
    ) {
      console.log('Models exist but part does not exist');

      const partNumberDocRef = query(
        collectionGroup(db, 'Parts'),
        where('partNumber', '==', values.partNumber)
      );
      const queryPartNumber = await getDocs(partNumberDocRef);

      const partData = queryPartNumber.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //checking to see if part# already exists

      if (partData.length != 0) {
        setNotify({
          isOpen: true,
          message: 'Part number already exist',
          type: 'error',
        });

        setLoading(false);
      } else {
        const newPartRef = await addDoc(collection(db, 'Shared Part Numbers'), {
          partNumber: values.partNumber,
          partName: values.partId,
          model: [modelSelection[0], modelSelection[1]],
        });

        await addDoc(
          collection(
            db,
            'Shared Part Numbers',
            newPartRef.id,
            'Serial Numbers'
          ),
          {
            timestamp: serverTimestamp(),
            deliveryNumber: values.deliveryNumber,
            user: session.user.name,
            serialNumber: values.serialNumber.toUpperCase(),
            partName: values.partId,
            partNumber: values.partNumber,
            model: [modelSelection[0], modelSelection[1]],
          }
        );

        //getting stock(number of serials) from shared part number

        const subCollectionSnapshot = await getDocs(
          collection(db, 'Shared Part Numbers', newPartRef.id, 'Serial Numbers')
        );
        subCollectionSnapshot.forEach((docs) => {
          sharedSerialsArray.push(docs.data());
        });

        //setting stock and part info for  model1

        await addDoc(collection(db, 'iPhone Models', model1[0].id, 'Parts'), {
          partNumber: values.partNumber,
          model: [modelSelection[0], modelSelection[1]],
          stock: sharedSerialsArray.length,
          reserved: 0,
          sharedPartNumber: true,
          available: sharedSerialsArray.length,
          partName: values.partId,
        });

        //setting stock and part info for  model2

        await addDoc(collection(db, 'iPhone Models', model2[0].id, 'Parts'), {
          partNumber: values.partNumber,
          model: [modelSelection[0], modelSelection[1]],
          stock: sharedSerialsArray.length,
          reserved: 0,
          sharedPartNumber: true,
          available: sharedSerialsArray.length,
          partName: values.partId,
        });

        setNotify({
          isOpen: true,
          message: 'Added successfully',
          type: 'success',
        });

        setLoading(false);
      }
    } else if (
      model1InDb == true &&
      model2InDb == true &&
      model1PartNameExist == true &&
      model2PartNameExist == false &&
      singlePartModel1 == false &&
      singlePartModel2 == false
    ) {
      setNotify({
        isOpen: true,
        message:
          modelSelection[0] +
          ' is sharing the ' +
          values.partId +
          ' part already',
        type: 'error',
      });

      setLoading(false);
    } else if (
      model1InDb == true &&
      model2InDb == true &&
      model1PartNameExist == false &&
      model2PartNameExist == true &&
      singlePartModel1 == false &&
      singlePartModel2 == false
    ) {
      setNotify({
        isOpen: true,
        message:
          modelSelection[1] +
          ' is sharing the ' +
          values.partId +
          ' part already',
        type: 'error',
      });

      setLoading(false);
    } else if (
      (model1InDb == true && model2InDb == false) ||
      (model1InDb == false && model2InDb == true)
    ) {
      console.log('One of the models does not exist and part does not exist');

      //Looking for duplicate part#'s
      const partNumberQuery = query(
        collectionGroup(db, 'Parts'),
        where('partNumber', '==', values.partNumber)
      );
      const queryPartNumbers = await getDocs(partNumberQuery);

      const partNumberData = queryPartNumbers.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Part number in DB?');

      console.log(partNumberData);

      if (partNumberData.length != 0) {
        setNotify({
          isOpen: true,
          message: 'Part number already exists',
          type: 'error',
        });
      } else {
        if (model1PartNameExist == null && model2PartNameExist == true) {
          setNotify({
            isOpen: true,
            message:
              modelSelection[1] +
              ' is sharing the ' +
              values.partId +
              ' part already',
            type: 'error',
          });
        } else if (model1PartNameExist == true && model2PartNameExist == null) {
          setNotify({
            isOpen: true,
            message:
              modelSelection[0] +
              ' is sharing the ' +
              values.partId +
              ' part already',
            type: 'error',
          });
        } else {
          if (model1InDb == false) {
            newModel1Ref = await addDoc(collection(db, 'iPhone Models'), {
              model: modelSelection[0],
            });

            const newPartRef = await addDoc(
              collection(db, 'Shared Part Numbers'),
              {
                partNumber: values.partNumber,
                partName: values.partId,
                model: [modelSelection[0], modelSelection[1]],
              }
            );

            await addDoc(
              collection(
                db,
                'Shared Part Numbers',
                newPartRef.id,
                'Serial Numbers'
              ),
              {
                timestamp: serverTimestamp(),
                deliveryNumber: values.deliveryNumber,
                user: session.user.name,
                serialNumber: values.serialNumber.toUpperCase(),
                partName: values.partId,
                partNumber: values.partNumber,
                model: [modelSelection[0], modelSelection[1]],
              }
            );

            //getting stock(number of serials) from shared part number

            const subCollectionSnapshot = await getDocs(
              collection(
                db,
                'Shared Part Numbers',
                newPartRef.id,
                'Serial Numbers'
              )
            );
            subCollectionSnapshot.forEach((docs) => {
              sharedSerialsArray.push(docs.data());
            });

            //setting stock and part info for  model1

            await addDoc(
              collection(db, 'iPhone Models', newModel1Ref.id, 'Parts'),
              {
                partNumber: values.partNumber,
                model: [modelSelection[0], modelSelection[1]],
                stock: sharedSerialsArray.length,
                reserved: 0,
                sharedPartNumber: true,
                available: sharedSerialsArray.length,
                partName: values.partId,
              }
            );

            //setting stock and part info for  model2

            await addDoc(
              collection(db, 'iPhone Models', model2[0].id, 'Parts'),
              {
                partNumber: values.partNumber,
                model: [modelSelection[0], modelSelection[1]],
                stock: sharedSerialsArray.length,
                reserved: 0,
                sharedPartNumber: true,
                available: sharedSerialsArray.length,
                partName: values.partId,
              }
            );
          } else if (model2InDb == false) {
            newModel2Ref = await addDoc(collection(db, 'iPhone Models'), {
              model: modelSelection[1],
            });

            const newPartRef = await addDoc(
              collection(db, 'Shared Part Numbers'),
              {
                partNumber: values.partNumber,
                partName: values.partId,
                model: [modelSelection[0], modelSelection[1]],
              }
            );

            await addDoc(
              collection(
                db,
                'Shared Part Numbers',
                newPartRef.id,
                'Serial Numbers'
              ),
              {
                timestamp: serverTimestamp(),
                deliveryNumber: values.deliveryNumber,
                user: session.user.name,
                serialNumber: values.serialNumber.toUpperCase(),
                partName: values.partId,
                partNumber: values.partNumber,
                model: [modelSelection[0], modelSelection[1]],
              }
            );

            //getting stock(number of serials) from shared part number

            const subCollectionSnapshot = await getDocs(
              collection(
                db,
                'Shared Part Numbers',
                newPartRef.id,
                'Serial Numbers'
              )
            );
            subCollectionSnapshot.forEach((docs) => {
              sharedSerialsArray.push(docs.data());
            });

            //setting stock and part info for  model2

            await addDoc(
              collection(db, 'iPhone Models', newModel2Ref.id, 'Parts'),
              {
                partNumber: values.partNumber,
                model: [modelSelection[0], modelSelection[1]],
                stock: sharedSerialsArray.length,
                reserved: 0,
                sharedPartNumber: true,
                available: sharedSerialsArray.length,
                partName: values.partId,
              }
            );

            //setting stock and part info for  model1

            await addDoc(
              collection(db, 'iPhone Models', model1[0].id, 'Parts'),
              {
                partNumber: values.partNumber,
                model: [modelSelection[0], modelSelection[1]],
                stock: sharedSerialsArray.length,
                reserved: 0,
                sharedPartNumber: true,
                available: sharedSerialsArray.length,
                partName: values.partId,
              }
            );
          }
        }
        setLoading(false);
      }
    }
  };

  //Single Model --------------------------------------------------------

  const AddPart = async () => {
    let partNameFoundInDb = null;
    let partNumberMatchesInput = null;
    let modelInDb = null;
    let stockArray = [];
    let isOnlyOne = null;
    let partNumberInDb = null;
    const partQuery = null;
    const queryPartSnapshot = null;
    const partNumberData = null;
    const modelDb = null;

    //Checks to see if serial# already exist
    setLoading(true);

    const serialData = await partService.CheckSerialNumber(values.serialNumber);

    if (modelSelection.length == 2 && serialData.length <= 0) {
      console.log('2 models selected');

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
    console.log(modelDb);

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

        await partService.UpdateStock(newModelDocRef.id, newPartDocRef.id);

        setNotify({
          isOpen: true,
          message: 'Added successfully',
          type: 'success',
        });

        //setModelSelection([]);
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
            console.log('Part ' + values.partId + ' is being shared');

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
            console.log(
              'Adds a new serial# of a part# that already exists in the database.'
            );

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

            await partService.UpdateStock(modelDb[0].id, partNameData[0].id);

            setNotify({
              isOpen: true,
              message: 'Added successfully',
              type: 'success',
            });

            // setModelSelection([]);
            // resetForm();
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
        console.log('FALSE : part selected is NOT in DB');
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
          console.log(
            'Adds a new part with a new part# to a model that already exists in the database'
          );

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

          await partService.UpdateStock(modelDb[0].id, newPartDocRef.id);

          setNotify({
            isOpen: true,
            message: 'Added successfully',
            type: 'success',
          });

          //setModelSelection([]);
          //resetForm();
          setLoading(false);
        }
      }
    }
  };

  const validate = () => {
    let temp = {};
    temp.multiId = modelSelection.length > 0 ? '' : 'This field is required';
    temp.partId = values.partId ? '' : 'This field is required';
    temp.partNumber = values.partNumber ? '' : 'This field is required';
    temp.serialNumber =
      values.serialNumber.length > 9 ? '' : 'This field is required';
    temp.deliveryNumber =
      values.deliveryNumber.length > 9 ? '' : 'This field is required';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == '');
  };

  const Submit = async (event) => {
    event.preventDefault();
    if (validate()) {
      AddPart();
    } else {
      const test = validate();
      console.log(test);
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
                  // error={values.deliveryNumber === ''}

                  error={errors.deliveryNumber}
                />
                {/* <TextInput
                  sx={{ width: '100%' }}
                  label="Delivery Number"
                  value={nValues.deliveryNumber}
                  name="deliveryNumber"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                  onChange={nOnChange}
                /> */}
              </Box>

              <Box
                sx={{
                  width: '80%',
                  marginTop: '20px',
                }}
              >
                <Button variant="contained" type="submit">
                  {loading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </Box>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Popup
        title="Please Enter Part Name"
        openPopup={openUsePopup}
        setOpenPopup={setOpenUsePopup}
      >
        <TextInput
          name="partName"
          value={values.partName}
          onChange={handleInputChange}
          sx={{ width: '100%', marginTop: 1, marginBottom: 2 }}
          label="Part name..."
        />
        <Button onClick={() => addPartName()}>ADD</Button>
      </Popup>
      <Popup
        title="Please Enter Model Name"
        openPopup={openModelsPopup}
        setOpenPopup={setModelsOpenPopup}
      >
        <TextInput
          name="modelName"
          value={values.modelName}
          onChange={handleInputChange}
          sx={{ width: '100%', marginTop: 1, marginBottom: 2 }}
          label="Model name..."
        />
        <Button onClick={() => addModelName()}>ADD</Button>
      </Popup>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
}

export default PartForm;
