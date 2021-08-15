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

export function Profile() {
    const { signOut } = useContext(AuthContext);
    const user = firebase.auth().currentUser;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    console.log(user)

    function handleLogout() {
        signOut();
    }

    function handleUpdate() {
        if(user){
            user.updateProfile({
                displayName: name
            }).catch((error) => {
                console.log(error)
            });
    
            user.updateEmail(email)
                .catch((error) => {
                    console.log(error)
                });
    
            user.updatePassword(password).catch((error) => {
                console.log(error)
            });
        }
        setEmail('');
        setPassword('');
        setName('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack title="Seu perfil" />
            <View style={styles.innerContainer}>
                <Text>Profile</Text>
                <TextInput style={styles.input} placeholder="Nome"
                    value={name}
                    onChangeText={text => setName(text)} />
                <TextInput style={styles.input} placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)} />
                <TextInput style={styles.input} placeholder="Senha"
                    value={password}
                    onChangeText={text => setPassword(text)} />
                <Button title="Salvar" onPress={handleUpdate} btnStyle={styles.btnSair} txtStyle={styles.txtSair} />
                <Button title="Sair" onPress={handleLogout} btnStyle={styles.btnSair} txtStyle={styles.txtSair} />
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
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
});

export default Profile;
