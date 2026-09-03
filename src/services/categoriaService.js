import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const categoriaCollectionRef = collection(db, 'categorias');

// Mapeia o método listar() do Diagrama de Classes
export const listarCategorias = async () => {
  try {
    const querySnapshot = await getDocs(categoriaCollectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    throw error;
  }
};

// Função auxiliar para cadastrar categorias iniciais (ex: Chaves, Carteira, Eletrônicos)
export const cadastrarCategoria = async (name, icone) => {
  try {
    await addDoc(categoriaCollectionRef, { name, icone });
  } catch (error) {
    console.error("Erro ao cadastrar categoria:", error);
  }
};