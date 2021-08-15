import React, { useState, useEffect, useCallback } from "react";
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

export function News() {
    const [tempNews, setTempNews] = useState();
    const [noticias, setNoticias] = useState();
    const [loading, setLoading] = useState(true);

    const regex = /<p>(.*?)<\/p>/;

    useEffect(() => {
        function loadNews() {
            setLoading(true);
            axios.get('https://www.mobills.com.br/blog/feed/?barra=esconder')
                .then(response => {
                    let list = [];
                    parseString(response.data, function (err, result) {
                        Object.entries(result.rss.channel[0]).map(([item, value]) => {
                            if (item == 'item') {
                                Object.entries(value).map(([item2, value2]) => {
                                    list.push(value2)
                                })
                            }
                        });
                        setTempNews(list);
                    });
                })
                .then(() => {
                    const noticia = [];
                    tempNews && tempNews.forEach((item, index) => {
                        const corresp = regex.exec(item.description[0]);
                        const firstParagraphWithoutHtml = (corresp) ? corresp[1] : "";

                        const temp = {
                            id: index,
                            title: item.title[0],
                            description: firstParagraphWithoutHtml,
                            link: item.link[0]
                        }

                        noticia.push(temp)
                    })

                    setNoticias(noticia);
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        loadNews();
        setLoading(false);
    }, [])

    useEffect(() => {
        console.log(loading)
    }, [loading])

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
                    extraData={loading}
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
