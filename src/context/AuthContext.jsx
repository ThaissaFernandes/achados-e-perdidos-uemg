import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta as mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Busca os dados complementares do perfil no Firestore
          const docRef = doc(db, 'usuarios', firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUsuario({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...docSnap.data() // traz nome, numeroCadastro, tipo, etc.
            });
          } else {
            // Caso o documento no Firestore ainda não exista
            setUsuario({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              tipo: 'usuario'
            });
          }
        } catch (error) {
          console.error("Erro ao carregar dados do perfil:", error);
          setUsuario(null);
        }
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading, eAdmin: usuario?.tipo === 'admin' }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o AuthContext de forma simples nas páginas
export const useAuth = () => {
  return useContext(AuthContext);
};