import React, { useContext } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { Button } from "../components/Button";
import { HeaderBack } from "../components/HeaderBack";
import { AuthContext } from '../contexts/auth';
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Profile() {
    const { signOut } = useContext(AuthContext);

    function handleLogout() {
        signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack title="Seu perfil" />
            <View style={styles.innerContainer}>
                <Text>Profile</Text>
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
    }
});

export default Profile;
