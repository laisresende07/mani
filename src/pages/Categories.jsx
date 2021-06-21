import React from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
} from "react-native";

export function Categories() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Categories</Text>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default Categories;
