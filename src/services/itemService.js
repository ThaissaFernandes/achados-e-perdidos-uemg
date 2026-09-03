import { db, storage } from '../config/firebase';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const itemCollectionRef = collection(db, 'itens');

// Faz o upload da foto diretamente no Firebase Storage e retorna a URL permanente
export const uploadFotoItem = async (file) => {
  if (!file) return '';
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `itens/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

// Mapeia o método cadastrar() do Diagrama de Classes
export const cadastrarItem = async (dadosItem) => {
  try {
    const docRef = await addDoc(itemCollectionRef, {
      titulo: dadosItem.titulo,
      descricao: dadosItem.descricao,
      localEncontrado: dadosItem.localEncontrado,
      categoriaId: dadosItem.categoriaId,
      fotoUrl: dadosItem.fotoUrl || '',
      status: (dadosItem.status || 'disponível').toLowerCase(),
      dataCadastro: serverTimestamp(),
      criadoPor: dadosItem.criadoPor || 'admin'
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao cadastrar item:", error);
    throw error;
  }
};

// Alias para compatibilidade com o RegistrarItem.jsx
export const criarItem = cadastrarItem;

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
    await updateDoc(itemRef, { status: novoStatus.toLowerCase() });
  } catch (error) {
    console.error("Erro ao atualizar status do item:", error);
    throw error;
  }
};