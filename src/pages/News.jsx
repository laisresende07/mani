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
import axios from 'axios';
import { parseString } from "react-native-xml2js";
import { HeaderBack } from "../components/HeaderBack";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function News() {
    const [noticias, setNoticias] = useState([]);

    useEffect(() => {
        let list = [];

        const regex = /<p>(.*?)<\/p>/;
        axios
            .get("https://www.mobills.com.br/blog/feed/?barra=esconder")
            .then((response) => {
                parseString(response.data, function (err, result) {
                    Object.entries(result.rss.channel[0]).map(([item, value]) => {
                        if (item == "item") {
                            Object.entries(value).map(([item2, value2]) => {
                                list.push(value2);
                            });
                        }
                    });
                });
            })
            .then(() => {
                const noticia = [];
                list &&
                    list.forEach((item, index) => {
                        const corresp = regex.exec(item.description[0]);
                        const firstParagraphWithoutHtml = corresp ? corresp[1] : "";

                        const temp = {
                            id: index,
                            title: item.title[0],
                            description: firstParagraphWithoutHtml,
                            link: item.link[0],
                        };

                        noticia.push(temp);
                    });

                setNoticias(noticia);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <TouchableOpacity onPress={handlePress} style={styles.btn}>
            <Text style={styles.btnText}>{children}</Text>
        </TouchableOpacity>;
    };


    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack />
            <View style={styles.innerContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={noticias}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.newsItem}>
                            <Text style={styles.newsTitle}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
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
    newsItem: {
        marginBottom: 30,
        borderWidth: 1,
        borderColor: colors.orange,
        borderRadius: 5,
        padding: 15,
        paddingBottom: 25
    },
    newsTitle: {
        marginBottom: 5,
        fontFamily: fonts.semibold,
        color: colors.blue,
        lineHeight: 18,
        fontSize: 16
    },
    description: {
        fontFamily: fonts.regular,
        fontSize: 15,
        lineHeight: 17
    },
    btn: {
        backgroundColor: colors.orange, 
        position: 'absolute', 
        height: 30, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 4, 
        width: 90, 
        bottom: -15, 
        right: 15
    },
    btnText: {
        fontFamily: fonts.semibold,
        color: colors.white, 
        textTransform: 'uppercase', 
        fontSize: 13, 
        letterSpacing: 1 
    }
});

export default News;
