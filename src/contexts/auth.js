import React, { createContext, useState, useEffect } from "react";
import firebase from "../services/firebaseConnection";

import axios from "axios";
import { parseString } from "react-native-xml2js";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [noticias, setNoticias] = useState();

  async function signIn(email, password) {
    setLoadingAuth(true);
    
    let list = [];

    const regex = /<p>(.*?)<\/p>/;
    axios
      .get("https://www.mobills.com.br/blog/feed/?barra=esconder")
      .then((response) => {
        parseString(response.data, function (err, result) {
          Object.entries(result.rss.channel[0]).map(([item, value]) => {
            if (item == "item") {
              Object.entries(value).map(([item2, value2]) => {
                list.push(value2);
              });
            }
          });
        });
      })
      .then(() => {
        const noticia = [];
        list &&
          list.forEach((item, index) => {
            const corresp = regex.exec(item.description[0]);
            const firstParagraphWithoutHtml = corresp ? corresp[1] : "";

            const temp = {
              id: index,
              title: item.title[0],
              description: firstParagraphWithoutHtml,
              link: item.link[0],
            };

            noticia.push(temp);
          });

        setNoticias(noticia);
      })
      .then(async () => {
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
                setLoadingAuth(false);
              });
          })
          .catch((error) => {
            alert(error.code);
            setLoadingAuth(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function signUp(nome, email, password) {
    setLoadingAuth(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
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
        alert(error.code);
        setLoadingAuth(false);
      });
  }

  async function signOut() {
    await firebase.auth().signOut();
    setUser(null);
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
        noticias,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
