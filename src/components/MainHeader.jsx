import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/core";

export function MainHeader() {

    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <Icon
                name="menu"
                size={24}
                onPress={() => navigation.toggleDrawer()}
            />
            <Icon
                name="user"
                size={24}
                onPress={() => navigation.navigate("Perfil")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
