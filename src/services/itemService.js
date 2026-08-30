import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

const itemCollectionRef = collection(db, 'itens');

// Mapeia o método cadastrar() do Diagrama de Classes
export const cadastrarItem = async (dadosItem) => {
  try {
    const docRef = await addDoc(itemCollectionRef, {
      titulo: dadosItem.titulo,
      descricao: dadosItem.descricao,
      localEncontrado: dadosItem.localEncontrado,
      categoriaId: dadosItem.categoriaId,
      fotoUrl: dadosItem.fotoUrl || '',
      status: 'Disponível',
      dataRegistro: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao cadastrar item:", error);
    throw error;
  }
};

// Mapeia o método buscarPorFiltro() do Diagrama de Classes
export const listarItens = async (categoriaId = null, local = null) => {
  try {
    let q = itemCollectionRef;
    if (categoriaId) {
      q = query(itemCollectionRef, where('categoriaId', '==', categoriaId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    throw error;
  }
};

// Mapeia o método atualizarStatus() do Diagrama de Classes
export const atualizarStatusItem = async (itemId, novoStatus) => {
  try {
    const itemRef = doc(db, 'itens', itemId);
    await updateDoc(itemRef, { status: novoStatus });
  } catch (error) {
    console.error("Erro ao atualizar status do item:", error);
    throw error;
  }
};