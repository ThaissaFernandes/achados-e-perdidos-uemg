import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const solicitacaoCollectionRef = collection(db, 'solicitacoesDevolucao');

export const criarSolicitacaoDevolucao = async (dadosSolicitacao) => {
  const docRef = await addDoc(solicitacaoCollectionRef, {
    itemId: dadosSolicitacao.itemId,
    itemTitulo: dadosSolicitacao.itemTitulo,
    usuarioId: dadosSolicitacao.usuarioId,
    nomeUsuario: dadosSolicitacao.nomeUsuario,
    numeroCadastro: dadosSolicitacao.numeroCadastro,
    status: 'Pendente',
    dataSolicitacao: new Date()
  });
  return docRef.id;
};

export const listarMinhasSolicitacoes = async (usuarioId) => {
  const q = query(solicitacaoCollectionRef, where("usuarioId", "==", usuarioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};