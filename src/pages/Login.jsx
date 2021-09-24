import React, { useState, useContext, useEffect } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

import { AuthContext } from "../contexts/auth";

import { Button } from '../components/Button';
import { useNavigation } from "@react-navigation/core";
import { HeaderBack } from "../components/HeaderBack";


export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                            autoCapitalize="none"
                            value={email}
                            onChangeText={text => setEmail(text)} />
                        <TextInput style={styles.input} placeholder="Digite sua senha"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            value={password}
                            onChangeText={text => setPassword(text)} />
                        <Button title={
                            loadingAuth ? (
                                <ActivityIndicator size={24} color="#fff" />
                            ) : (
                                'Entrar'
                            )
                        } onPress={handleLogin} btnStyle={styles.btnStyle2} txtStyle={styles.txtStyle2} />
                        <Button title="Ainda não tem uma conta? Cadastre-se!" onPress={handleSignUp} btnStyle={styles.btnStyle1} txtStyle={styles.txtStyle1} />
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
    }
});

export default Login;
