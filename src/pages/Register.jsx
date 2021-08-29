import React, { useState, useContext } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    ActivityIndicator
} from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

import {AuthContext} from "../contexts/auth";

import { Button } from '../components/Button';
import { useNavigation } from "@react-navigation/core";
import { HeaderBack } from "../components/HeaderBack";

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const {signUp, loadingAuth } = useContext(AuthContext);
    
    const navigation = useNavigation();

    function handleSignUp() {
        signUp(name, email, password);
    }

    function handleLogin() {
        navigation.navigate("Login");
    }

    return (
        <SafeAreaView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <HeaderBack />
            <KeyboardAvoidingView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>
                            CADASTRO
                        </Text>
                        <TextInput style={styles.input} placeholder="Nome"
                            value={name}
                            onChangeText={text => setName(text)} />
                        <TextInput style={styles.input} placeholder="Email"
                        keyboardType="email-address"
                            value={email}
                            onChangeText={text => setEmail(text)} />
                        <TextInput style={styles.input} placeholder="Senha"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                        <Button title={
                                loadingAuth ? (
                                    <ActivityIndicator size={24} color="#fff" />
                                ) : (
                                    'Criar conta'
                                )
                            } onPress={handleSignUp} btnStyle={styles.btnStyle2} txtStyle={styles.txtStyle2} />
                        <Button title="Já tem uma conta? Faça login!" onPress={handleLogin} btnStyle={styles.btnStyle1} txtStyle={styles.txtStyle1} />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    btnStyle2: {
        backgroundColor: colors.blue,
        marginVertical: 10
    },
    txtStyle2: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.semibold,
    },
    btnStyle1: {
        height: 30
    },
    txtStyle1: {
        fontSize: 16,
        color: colors.orange,
        fontFamily: fonts.semibold,
    },
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 100,
        flex: 1
    },
    title: {
        fontSize: 32,
        textAlign: "center",
        color: colors.orange,
        fontFamily: fonts.semibold,
        letterSpacing: 10
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        height: 50,
        width: '100%',
        borderRadius: 6,
        paddingHorizontal: 20,
        marginVertical: 10,
        fontSize: 16
    },
    fingerprint: {
        paddingTop: 50
    }
});

export default Register;
