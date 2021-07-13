import React from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
} from "react-native";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import {Button} from '../components/Button';

import payment from '../assets/payment.png';
import logo from '../assets/logo-texto.png';
import { useNavigation } from "@react-navigation/core";

export function Welcome() {
    const navigation = useNavigation();

    function handleLogin(){
        navigation.navigate('Login');
    }

    function handleRegister(){
        navigation.navigate('Register');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <Image source={logo} resizeMode="center" style={{height: 50, marginTop: 40}} />
                <Text style={styles.subtitle}>
                    Maneira mais{'\n'}simples de gerenciar{'\n'}suas finanças{'\n'}pessoais
                </Text>
                <Image source={payment} resizeMode="contain" style={styles.image} />
                <Button title="Entrar" onPress={handleLogin} btnStyle={styles.btnStyle2} txtStyle={styles.txtStyle2}/>
                <Button title="Criar uma conta" onPress={handleRegister} btnStyle={styles.btnStyle1} txtStyle={styles.txtStyle1}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnStyle1: {
        borderWidth: 2,
        borderColor: colors.orange
    },
    txtStyle1: {
        fontSize: 16,
        color: colors.orange,
        fontFamily: fonts.semibold
    },
    btnStyle2: {
        backgroundColor: colors.blue
    },
    txtStyle2: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.semibold
    },
    wrapper: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        paddingVertical: 100
    },
    title: {
        fontSize: 32,
        textAlign: "center",
        color: colors.orange,
        marginTop: 50,
        fontFamily: fonts.semibold,
    },
    image: {
        height: Dimensions.get("window").width * 0.8,
        marginLeft: Dimensions.get("window").width * -0.15,
    },
    subtitle: {
        textAlign: "right",
        width: '100%',
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 5,
        color: colors.blue,
        fontFamily: fonts.regular,
        lineHeight: 14,
    },
    button: {
        backgroundColor: colors.green,
        height: 56,
        width: 56,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        marginBottom: 10,
    },
});

export default Welcome;
