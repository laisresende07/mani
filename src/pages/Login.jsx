import React, { useState, useContext } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

import { AuthContext } from "../contexts/auth";

import { Button } from '../components/Button';
import { useNavigation } from "@react-navigation/core";
import { HeaderBack } from "../components/HeaderBack";

export function Login() {
    const [email, setEmail] = useState('carol@gmail.com');
    const [password, setPassword] = useState('carol123');

    const navigation = useNavigation();

    const { signIn, loadingAuth } = useContext(AuthContext);

    function handleLogin() {
        signIn(email, password);
    }

    function handleSignUp() {
        navigation.navigate('Register')
    }

    return (
        <SafeAreaView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <HeaderBack />
            <KeyboardAvoidingView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>
                            LOGIN
                        </Text>
                        <TextInput style={styles.input} placeholder="Digite seu email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={text => setEmail(text)} />
                        <TextInput style={styles.input} placeholder="Digite sua senha"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={text => setPassword(text)} />
                        <Button title="Entrar" onPress={handleLogin} btnStyle={styles.btnStyle2} txtStyle={styles.txtStyle2} />
                        <Button title="Ainda não tem uma conta? Cadastre-se!" onPress={handleSignUp} btnStyle={styles.btnStyle1} txtStyle={styles.txtStyle1} />
                        <TouchableOpacity style={styles.fingerprint}>
                            <MaterialIcons name="fingerprint" size={60} />
                        </TouchableOpacity>
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

export default Login;
