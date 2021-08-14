import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export function Button({ title, btnStyle, txtStyle, ...rest }) {
    return (
        <TouchableOpacity
            style={[styles.button, btnStyle]}
            activeOpacity={0.7}
            {...rest}
        >
            <Text style={txtStyle}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 6,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
    },   
});
