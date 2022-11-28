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
import { db } from '/config/firebase';

export async function CheckSerialNumber(data) {
  try {
    const serialQuery = query(
      collectionGroup(db, 'Serial Numbers'),
      where('serialNumber', '==', data)
    );
    const querySerialNumber = await getDocs(serialQuery);

    const serialData = querySerialNumber.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return serialData;
  } catch (e) {
    console.log('Error checking serial: ', e);
  }
}

export async function CheckModelInDb(data) {
  try {
    const q = query(
      collection(db, 'iPhone Models'),
      where('model', '==', data)
    );

    const queryModelSnapshot = await getDocs(q);

    const modelData = queryModelSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return modelData;
  } catch (e) {
    console.log('Error checking model: ', e);

    return 'error';
  }
}

export async function CheckPartNumber(partNumberValue) {
  try {
    const partNumberDocRef = query(
      collectionGroup(db, 'Parts'),
      where('partNumber', '==', partNumberValue)
    );
    const queryPartNumber = await getDocs(partNumberDocRef);

    const partNumberData = queryPartNumber.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return partNumberData;
  } catch (e) {
    console.log('Error checking part number: ', e);
    return 'error';
  }
}

export async function CheckPartName(modelSelected, partName) {
  try {
    const partNameQuery = query(
      collection(db, 'iPhone Models', modelSelected, 'Parts'),
      where('partName', '==', partName)
    );

    const queryPartName = await getDocs(partNameQuery);
    const partNameData = queryPartName.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return partNameData;
  } catch (e) {
    console.log('Error checking part name: ', e);
    return 'error';
  }
}

export async function CheckSharedPartStatus(modelId, partNumberId) {
  try {
    const docSharedRef = doc(
      db,
      'iPhone Models',
      modelId,
      'Parts',
      partNumberId
    );
    const docShared = await getDoc(docSharedRef);

    const partData = docShared.data();

    return partData.sharedPartNumber;
  } catch (e) {
    console.log('Error checking shared part status: ', e);
    return 'error';
  }
}

export async function CreateNewModel(modelSelected) {
  try {
    const modelDocRef = await addDoc(collection(db, 'iPhone Models'), {
      model: modelSelected,
    });

    return modelDocRef;
  } catch (e) {
    console.log('Error creating new model: ', e);

    return 'error';
  }
}

export async function CreateNewPart(
  partName,
  partNumber,
  modelSelected,
  modelId
) {
  let sharedValue = false;

  if (modelSelected.length >= 2) {
    sharedValue = true;
  }

  try {
    const partDocRef = await addDoc(
      collection(db, 'iPhone Models', modelId, 'Parts'),
      {
        partName: partName,
        partNumber: partNumber,
        model: modelSelected,
        stock: 0,
        reserved: 0,
        available: 0,
        sharedPartNumber: sharedValue,
        modelId: modelId,
      }
    );

    return partDocRef;
  } catch (e) {
    console.log('Error creating new part: ', e);
    return 'error';
  }
}

export async function AddSerial(
  modelId,
  partId,
  deliveryNumber,
  userName,
  serialNumber,
  partName,
  partNumber,
  modelSelected
) {
  try {
    await addDoc(
      collection(
        db,
        'iPhone Models',
        modelId,
        'Parts',
        partId,
        'Serial Numbers'
      ),
      {
        timestamp: serverTimestamp(),
        deliveryNumber: deliveryNumber,
        user: userName,
        serialNumber: serialNumber,
        partName: partName,
        partNumber: partNumber,
        model: modelSelected,
        modelId: modelId,
      }
    );

    //logger

    await addDoc(collection(db, 'Parts Added Logger'), {
      timestamp: serverTimestamp(),
      deliveryNumber: deliveryNumber,
      addedBy: userName,
      serialNumber: serialNumber,
      partName: partName,
      partNumber: partNumber,
      model: modelSelected,
    });
  } catch (e) {
    console.log('Error adding serial number: ', e);

    return 'error';
  }
}

export async function UpdateStock(modelId, partId, partNumber) {
  const stock = [];
  const partsData = await CheckPartNumber(partNumber);

  try {
    const subCollectionSnapshot = await getDocs(
      collection(
        db,
        'iPhone Models',
        modelId,
        'Parts',
        partId,
        'Serial Numbers'
      )
    );
    subCollectionSnapshot.forEach((docs) => {
      stock.push(docs.data());
    });

    await updateDoc(doc(db, 'iPhone Models', modelId, 'Parts', partId), {
      stock: stock.length,
      available: stock.length - partsData[0].reserved,
    });
  } catch (e) {
    console.log('Error updating stock: ', e);
  }
}

export async function RemoveSerialNumber(
  serialData,
  user,
  serialNumbersDocRef
) {
  try {
    for (let i = 0; i < serialData.length; i++) {
      const stock = [];
      const partsData = await CheckPartNumber(serialData[i].partNumber);
      //Updating stock
      const subCollectionSnapshot = await getDocs(
        collection(
          db,
          'iPhone Models',
          partsData[i].modelId,
          'Parts',
          partsData[i].id,
          'Serial Numbers'
        )
      );
      subCollectionSnapshot.forEach((docs) => {
        stock.push(docs.data());
      });

      if (partsData[i].reserved != 0) {
        await updateDoc(
          doc(
            db,
            'iPhone Models',
            partsData[i].modelId,
            'Parts',
            partsData[i].id
          ),
          {
            stock: stock.length - 1,
            reserved: partsData[i].reserved - 1,
            available: stock.length - partsData[i].reserved,
          }
        );
      } else if (partsData[i].reserved == 0) {
        await updateDoc(
          doc(
            db,
            'iPhone Models',
            partsData[i].modelId,
            'Parts',
            partsData[i].id
          ),
          {
            stock: stock.length - 1,
            available: stock.length - 1,
          }
        );
      }

      //logger
      await addDoc(collection(db, 'Parts Used Logger'), {
        timestamp: serverTimestamp(),
        deliveryNumber: serialData[i].deliveryNumber,
        removedBy: user,
        serialNumber: serialData[i].serialNumber,
        partName: partsData[i].partName,
        partNumber: partsData[i].partNumber,
        model: partsData[i].model,
      });
    }

    //Removing docs that match serial number
    serialNumbersDocRef.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (e) {
    console.log('Error removing serial number: ', e);
  }
}
