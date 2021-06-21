import React, {useState} from "react";
import { StyleSheet, TouchableWithoutFeedback, Text, Animated, View } from "react-native";

import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/core";

export function FloatingButton() {
    const [active, setActive] = useState(false);

    const navigation = useNavigation();

    function handleButtons(){
        setActive(!active)
        console.log(active)
    }

    function addIncome(){
        navigation.navigate('Registros')
    }

    function addExpense(){
        navigation.navigate('Notícias')
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={addIncome}>
                <Animated.View style={[styles.button, styles.secondary, active?styles.top:'']}>
                    <MaterialIcons name="north-east" size={24} color={colors.green} />
                </Animated.View>
            </TouchableWithoutFeedback> 

            <TouchableWithoutFeedback onPress={addExpense}>
                <Animated.View style={[styles.button, styles.secondary, active?styles.bottom:'']}>
                    <MaterialIcons name="south-west" size={24} color={colors.red} />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleButtons}>
                <Animated.View style={[styles.button, styles.main, active?styles.rotate:'']}>
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
        right: 25
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
    bottom: {
        bottom: 15,
    },
    top: {
        bottom: 72
    },
    rotate: {
        transform: [{ rotate: "45deg" }]
    }
});

export default FloatingButton;
