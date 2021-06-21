import React from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
} from "react-native";

export function Profile() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Profile</Text>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default Profile;
