import React, { useState, useEffect, useCallback, useContext } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    View,
    Linking,
    Alert
} from "react-native";
// import { parse } from 'fast-xml-parser';
import axios from 'axios';
import { parseString } from "react-native-xml2js";
import { MainHeader } from "../components/MainHeader";
import colors from "../styles/colors";

import { AuthContext } from '../contexts/auth'

export function News() {

    const { noticias } = useContext(AuthContext);

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <TouchableOpacity onPress={handlePress} style={{ backgroundColor: colors.orange, position: 'absolute', height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, width: 90, bottom: -15, right: 15 }}>
            <Text style={{ fontWeight: 'bold', color: colors.white, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>{children}</Text>
        </TouchableOpacity>;
    };


    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />
            <View style={styles.innerContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={noticias}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 30, borderWidth: 1, borderColor: colors.orange, borderRadius: 5, padding: 15, paddingBottom: 30 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
                            <Text>{item.description}</Text>
                            <OpenURLButton url={item.link}>Ler mais</OpenURLButton>
                        </View>
                    )}
                />
            </View>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        marginHorizontal: 0,
        backgroundColor: colors.shape
    },
    innerContainer: {
        marginTop: 30,
        marginHorizontal: 20,
        flex: 1,
    },
});

export default News;
