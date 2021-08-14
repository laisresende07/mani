import React, { useState, useContext } from "react";
import {
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    View
} from "react-native";
import { MainHeader } from '../components/MainHeader';

import firebase from '../services/firebaseConnection';
import { AuthContext } from '../contexts/auth';

import { useNavigation } from "@react-navigation/core";

export function Categories() {
    const navigation = useNavigation();

    const { user } = useContext(AuthContext);
    const uid = user && user.uid;

    const [mode, setMode] = useState('despesa');

    async function handleAddCategory() {
        let uid = user.uid;

        let key = await firebase.database().ref('categorias').child(uid).push().key;
        await firebase.database().ref('categorias').child(uid).child(key).set({
            nome: 'Estudos',
            tipo: mode
        })

        // Keyboard.dismiss();
        // setValor('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />
            <View style={styles.innerContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 100 }}>
                    <TouchableOpacity onPress={() => setMode('receita')}>
                        <Text>Receita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMode('despesa')}>
                        <Text>Despesa</Text>
                    </TouchableOpacity>
                </View>
                {
                    (mode == 'receita') ?
                        <View>
                            <Text>RECEITA</Text>
                            <TouchableOpacity onPress={() => handleAddCategory()}>
                                <Text>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <Text>DESPESA</Text>
                            <TouchableOpacity onPress={() => handleAddCategory()}>
                                <Text>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                }
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
        marginHorizontal: 20
    }
});

export default Categories;
