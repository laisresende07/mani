import React, { useState, useContext } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    TextInput
} from "react-native";
import { AuthContext } from '../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import firebase from '../services/firebaseConnection';

export function Income() {
    const [valor, setValor] = useState('');

    const navigation = useNavigation();
    const { user: userContext } = useContext(AuthContext);

    function handleSubmit() {
        Keyboard.dismiss();
        if (isNaN(parseFloat(valor))) {
            alert('Preencha todos os campos');
            return;
        }

        Alert.alert(
            'Confirmando dados',
            `Tipo: Receita - Valor: R$ ${parseFloat(valor)}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Continuar',
                    onPress: () => handleAdd()
                }
            ]
        )
    }

    async function handleAdd() {
        let uid = userContext.uid;

        let key = await firebase.database().ref('historico').child(uid).push().key;
        await firebase.database().ref('historico').child(uid).child(key).set({
            tipo: 'receita',
            valor: parseFloat(valor),
            date: format(new Date(), 'dd/MM/yy')
        })

        let user = firebase.database().ref('users').child(uid);
        await user.once('value').then((snapshot) => {
            let saldo = parseFloat(snapshot.val().saldo);

            saldo += parseFloat(valor);

            user.child('saldo').set(saldo);
        });

        Keyboard.dismiss();
        setValor('');
        navigation.navigate('Home');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Income</Text>
            <TextInput
                placeholder="Valor desejado"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => Keyboard.dismiss()}
                value={valor}
                onChangeText={text => setValor(text)}
            />
            <TouchableWithoutFeedback onPress={handleSubmit}>
                <Text>Registrar</Text>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30
    },
});

export default Income;
