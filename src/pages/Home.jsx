import React, { useContext, useState, useEffect } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import firebase from '../services/firebaseConnection';
import { AuthContext } from '../contexts/auth';
import NumberFormat from 'react-number-format';
import { format } from 'date-fns';
import { useNavigation } from "@react-navigation/core";

import FloatingButton from '../components/FloatingButton';
import { HistoricoList } from "../components/HistoricoList";

export function Home() {
    const navigation = useNavigation();

    const [saldo, setSaldo] = useState(0);
    const [historico, setHistorico] = useState([]);

    const { user } = useContext(AuthContext);
    const uid = user && user.uid;

    useEffect(() => {
        async function loadList() {
            await firebase
                .database()
                .ref('users')
                .child(uid)
                .on('value', snapshot => {
                    setSaldo(snapshot.val().saldo);
                });

            await firebase
                .database()
                .ref('historico')
                .child(uid)
                .orderByChild('date')
                .equalTo(format(new Date(), 'dd/MM/yy'))
                .limitToLast(4)
                .on('value', snapshot => {
                    setHistorico([]);

                    snapshot.forEach(childItem => {
                        let list = {
                            key: childItem.key,
                            tipo: childItem.val().tipo,
                            valor: childItem.val().valor,
                        };

                        setHistorico(oldArray => [...oldArray, list].reverse());
                    });
                });
        }

        loadList();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.card, styles.row]}>
                <Text style={styles.text}>SALDO</Text>
                <Text style={styles.value}>
                    <NumberFormat
                        value={saldo}
                        displayType={'text'}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        decimalScale={2}
                        prefix={'R$ '}
                        fixedDecimalScale={true}
                        renderText={value => <Text>{value}</Text>}
                    />
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.caption}>HOJE</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.amount}>
                            <MaterialIcons name='north-east' size={20} style={styles.up} />
                            <Text style={styles.simpleText}>R$ 1.035,50</Text>
                        </View>
                        <View style={styles.amount}>
                            <MaterialIcons name='south-west' size={20} style={styles.down} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                    </View>
                    <FlatList
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                        data={historico}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => <HistoricoList data={item} />}
                    />
                    <TouchableOpacity style={styles.seeAllBtn} onPress={navigation.navigate("Registros")}>
                        <Text style={styles.seeAllTxt}>VER TUDO</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FloatingButton />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        marginHorizontal: 20,
        backgroundColor: colors.backgroundColor
    },
    card: {
        padding: 20,
        borderRadius: 6,
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 18,
        fontFamily: fonts.semibold,
        color: colors.orange
    },
    value: {
        fontSize: 20,
        fontFamily: fonts.semibold,
        color: colors.blue
    },
    content: {
        marginTop: 30
    },
    caption: {
        fontSize: 16,
        fontFamily: fonts.regular,
        color: colors.blue,
        marginBottom: 5
    },
    up: {
        paddingLeft: 7,
        paddingRight: 5,
        paddingTop: 7,
        paddingBottom: 5,
        borderRadius: 20,
        color: colors.green,
        borderWidth: 1,
        borderColor: colors.green
    },
    down: {
        paddingLeft: 7,
        paddingRight: 5,
        paddingTop: 7,
        paddingBottom: 5,
        borderRadius: 20,
        color: colors.red,
        borderWidth: 1,
        borderColor: colors.red
    },
    amount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    simpleText: {
        marginLeft: 7,
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.blue
    },
    list: {
        marginTop: 10
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: colors.orange,
        borderRadius: 6,
        padding: 10,
        marginTop: 10
    },
    seeAllBtn: {
        alignSelf: 'flex-end',
        marginTop: 10
    },
    seeAllTxt: {
        fontFamily: fonts.regular,
        color: colors.orange
    },
});

export default Home;
