import React, { useContext, useState, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "../components/Button";
import { HeaderBack } from "../components/HeaderBack";
import { AuthContext } from '../contexts/auth';
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import firebase from '../services/firebaseConnection';
import { useNavigation } from "@react-navigation/core";
import { MaterialIcons } from "@expo/vector-icons";

export function Profile({ route }) {
    const navigation = useNavigation();
    const { signOut } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            const user = firebase.auth().currentUser;

            setName(user.displayName);
            setEmail(user.email)
        });
        return focus;
    }, [navigation]);


    function handleLogout() {
        signOut();
    }

    function handleEditProfile() {
        navigation.navigate('EditProfile')
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack title="Seu perfil" />
            <View style={styles.innerContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>Olá, </Text>
                    <Text style={[styles.name, styles.bold]}>{route.params?.novoNome ? route.params?.novoNome : name}</Text>
                </View>

                <View>
                    <View style={styles.dadosView}>
                        <Text style={styles.dados}>Dados pessoais</Text>
                        <TouchableOpacity onPress={handleEditProfile}>
                            <MaterialIcons name='edit' size={22} color={colors.orange} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTxt}>{route.params?.novoNome ? route.params?.novoNome : name}</Text>
                        <Text style={styles.cardTxt}>{route.params?.novoEmail ? route.params?.novoEmail : email}</Text>
                    </View>
                </View>

                <Button title="Sair" onPress={handleLogout} btnStyle={styles.btnSair} txtStyle={styles.txtSair} />
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
    card: {
        padding: 20,
        borderRadius: 6,
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    cardTxt: {
        fontFamily: fonts.regular,
        fontSize: 17,
    },
    btnSair: {
        backgroundColor: colors.orange,
        marginTop: 60
    },
    txtSair: {
        textTransform: 'uppercase',
        color: colors.white,
        letterSpacing: 2,
        fontFamily: fonts.regular,
        fontSize: 18
    },
    row: {
        flexDirection: 'row',
        marginTop: 80
    },
    dadosView: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-between',
        marginBottom: 5
    },
    name: {
        fontSize: 20,
        color: colors.blue,
        letterSpacing: .7,
        fontFamily: fonts.regular
    },
    bold: {
        fontFamily: fonts.semibold
    },
    dados: {
        fontSize: 15,
        color: colors.orange,
        fontFamily: fonts.semibold,
        textTransform: 'uppercase'
    }
});

export default Profile;
