import React, { useContext } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { AuthContext } from '../contexts/auth';
import firebase from '../services/firebaseConnection'

export function Profile() {
    const { signOut } = useContext(AuthContext);

    function handleLogout() {
        signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Profile</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text>SAIR</Text>
            </TouchableOpacity>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
    },
});

export default Profile;
