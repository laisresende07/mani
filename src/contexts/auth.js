import React, { createContext, useState, useEffect } from "react";
import firebase from "../services/firebaseConnection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem("Auth_user");
      console.log(storageUser);

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  async function signIn(email, password) {
    setLoadingAuth(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await firebase
          .database()
          .ref("users")
          .child(uid)
          .once("value")
          .then((snapshot) => {
            let data = {
              uid: uid,
              nome: snapshot.val().nome,
              email: value.user.email,
            };
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          });
      })
      .catch((error) => {
        Alert.alert("", `Verifique seus dados e tente novamente`, [
          {
            text: "OK",
            style: "cancel",
          },
        ]);
        setLoadingAuth(false);
      });
  }

  async function signUp(nome, sobrenome, email, password) {
    setLoadingAuth(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const cuurentUser = firebase.auth().currentUser;
        cuurentUser.updateProfile({
          displayName: `${nome} ${sobrenome}`,
        });

        await firebase
          .database()
          .ref("users")
          .child(uid)
          .set({
            saldo: 0,
            nome: nome,
          })
          .then(async () => {
            let data = {
              uid: uid,
              nome: nome,
              email: value.user.email,
            };
            setUser(data);
            storageUser(data);

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Alimentação")
              .set({
                tipo: "despesa",
              });

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Salário")
              .set({
                tipo: "receita",
              });

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Educação")
              .set({
                tipo: "despesa",
              });

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Lazer")
              .set({
                tipo: "despesa",
              });

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Transporte")
              .set({
                tipo: "despesa",
              });

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Investimentos")
              .set({
                tipo: "receita",
              });

            await firebase
              .database()
              .ref("categorias")
              .child(uid)
              .child("Presente")
              .set({
                tipo: "receita",
              });

            setLoadingAuth(false);
          });
      })
      .catch((error) => {
        Alert.alert("", `Não foi possível criar a conta. Tente novamente.`, [
          {
            text: "OK",
            style: "cancel",
          },
        ]);
        setLoadingAuth(false);
      });
  }

  async function storageUser(data) {
    await AsyncStorage.setItem("Auth_user", JSON.stringify(data));
  }

  async function signOut() {
    await firebase.auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: user,
        user,
        loading,
        loadingAuth,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
