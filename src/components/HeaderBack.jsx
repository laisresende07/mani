import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { useNavigation } from "@react-navigation/core";
import { AntDesign } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function HeaderBack({ title }) {

    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <AntDesign name={"left"} size={24} color={colors.blue} onPress={() => navigation.goBack()} />
            <Text style={styles.title}>{title && title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        padding: 20,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'transparent'
    },
    title: {
        color: colors.blue,
        textTransform: 'uppercase',
        fontFamily: fonts.semibold,
        fontSize: 18,
        letterSpacing: .5,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});
