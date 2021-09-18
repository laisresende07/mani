import React, { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, Animated, View, Text } from "react-native";

import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/core";
import fonts from "../styles/fonts";

export function FloatingButton() {
    const [active, setActive] = useState(false);
    const [animation] = useState(new Animated.Value(0))

    const navigation = useNavigation();


    function handleButtons() {
        var toValue = active ? 0 : 1

        Animated.spring(animation, {
            toValue: toValue,
            friction: 5
        }).start()

        setActive(!active)
    }

    function addIncome() {
        setActive(false)
        navigation.navigate('Nova receita')
    }

    function addExpense() {
        setActive(false)
        navigation.navigate('Nova despesa')
    }

    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"]
                })
            }
        ]
    }

    const incomeStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -130]
                })
            }
        ]
    }

    const expenseStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70]
                })
            }
        ]
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.label, incomeStyle]}>
                <Text style={styles.text}>Nova receita</Text>
            </Animated.View>

            <TouchableWithoutFeedback onPress={addIncome}>
                <Animated.View style={[styles.button, styles.secondary, incomeStyle]}>
                    <MaterialIcons name="north-east" size={24} color={colors.green} />
                </Animated.View>
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.label, expenseStyle]}>
                <Text style={styles.text}>Nova despesa</Text>
            </Animated.View>

            <TouchableWithoutFeedback onPress={addExpense}>
                <Animated.View style={[styles.button, styles.secondary, expenseStyle]}>
                    <MaterialIcons name="south-west" size={24} color={colors.red} />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleButtons}>
                <Animated.View style={[styles.button, styles.main, rotation]}>
                    <AntDesign name={"plus"} size={24} color="#fff" />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        position: "absolute",
        bottom: 80,
        right: 25,
    },
    button: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: "center",
        justifyContent: "center",
        shadowRadius: 10,
        shadowColor: colors.gray,
        shadowOpacity: 0.3,
        shadowOffset: { height: 10 },
        elevation: 4,
    },
    main: {
        backgroundColor: colors.blue
    },
    secondary: {
        width: 48,
        height: 48,
        borderRadius: 48 / 2,
        backgroundColor: colors.white,
    },
    label: {
        position: "absolute",
        right: 40,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.blue,
    }
});

export default FloatingButton;
