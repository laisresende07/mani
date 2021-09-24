import React, { useContext, useState } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput
} from "react-native";
import { Button } from "../components/Button";
import { HeaderBack } from "../components/HeaderBack";
import { AuthContext } from '../contexts/auth';
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import firebase from '../services/firebaseConnection';
import { useNavigation } from "@react-navigation/core";

export function EditProfile() {
    const navigation = useNavigation();
    const user = firebase.auth().currentUser;
    const [name, setName] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');

    const { user: userContext } = useContext(AuthContext);
    const uid = userContext && userContext.uid;

    async function handleUpdate() {
        if (user) {
            if (name != '') {
                user.updateProfile({
                    displayName: name
                }).catch((error) => {
                    alert('Não conseguimos atualizar seu nome, por favor tente mais tarde.')
                });

                let saldo = 0;

                await firebase
                    .database()
                    .ref('users')
                    .child(uid)
                    .on('value', snapshot => {
                        saldo = snapshot.val().saldo;
                    });

                await firebase
                    .database()
                    .ref("users")
                    .child(uid)
                    .set({
                        nome: name,
                        saldo: saldo
                    })
            }

            if (email != '') {
                user.updateEmail(email)
                    .catch((error) => {
                        alert('Não conseguimos atualizar seu email, por favor tente mais tarde.')
                    });
            }

            if (password != '') {
                user.updatePassword(password).catch((error) => {
                    alert('Não conseguimos atualizar sua senha, por favor tente mais tarde.')
                });
            }
        }
        setEmail(user.email);
        setPassword('');
        setName(user.displayName);

        navigation.navigate('Profile', {novoNome: name, novoEmail: email});
    }

    function handleCancel() {
        setEmail(user.email);
        setPassword('');
        setName(user.displayName);

        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack />
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Dados pessoais</Text>
                <TextInput style={styles.input} placeholder="Nome"
                    value={name}
                    onChangeText={text => setName(text)} />
                <TextInput style={styles.input} placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)} />
                <Text style={styles.title}>Redefinir senha</Text>
                <TextInput style={styles.input} placeholder="Senha"
                    value={password}
                    onChangeText={text => setPassword(text)} />
                <Button title="Cancelar" onPress={handleCancel} btnStyle={styles.btnCancelar} txtStyle={styles.txtCancelar} />
                <Button title="Salvar" onPress={handleUpdate} btnStyle={styles.btnSalvar} txtStyle={styles.txtSalvar} />
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 20,
    },
    title: {
        fontFamily: fonts.semibold,
        color: colors.orange,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 40,
        textTransform: 'uppercase',
        letterSpacing: .7
    },
    btnSalvar: {
        backgroundColor: colors.blue,
        marginTop: 20
    },
    txtSalvar: {
        textTransform: 'uppercase',
        color: colors.white,
        letterSpacing: 2,
        fontFamily: fonts.regular,
        fontSize: 17
    },
    btnCancelar: {
        backgroundColor: colors.backgroundColor,
        marginTop: 60,
        borderWidth: 1,
        borderColor: colors.blue
    },
    txtCancelar: {
        textTransform: 'uppercase',
        color: colors.blue,
        letterSpacing: 2,
        fontFamily: fonts.regular,
        fontSize: 17
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        height: 50,
        width: '100%',
        borderRadius: 6,
        paddingHorizontal: 20,
        marginVertical: 10,
        fontSize: 16,
        fontFamily: fonts.regular
    },
});

export default EditProfile;
