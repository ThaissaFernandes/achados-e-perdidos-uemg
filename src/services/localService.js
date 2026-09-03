import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const localCollectionRef = collection(db, 'locais');

export const listarLocaisAtivos = async () => {
  const q = query(localCollectionRef, where("status", "==", true));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};