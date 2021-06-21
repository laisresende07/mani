import React, { useContext, useState, useEffect } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import firebase from '../services/firebaseConnection';
import { AuthContext } from '../contexts/auth';

import FloatingButton from '../components/FloatingButton';

export function Home() {
    const [saldo, setSaldo] = useState(0);

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
        }

        loadList();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.card, styles.row]}>
                <Text style={styles.text}>SALDO</Text>
                <Text style={styles.value}>R$ {(+saldo).toFixed(2)}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.caption}>HOJE</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.amount}>
                            <MaterialIcons name='north-east' size={20} style={styles.up} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                        <View style={styles.amount}>
                            <MaterialIcons name='south-west' size={20} style={styles.down} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                    </View>
                    <View style={styles.list}>
                        <View style={styles.item}>
                            <MaterialIcons name='south-west' size={20} style={styles.down} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                        <View style={styles.item}>
                            <MaterialIcons name='north-east' size={20} style={styles.up} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                        <View style={styles.item}>
                            <MaterialIcons name='north-east' size={20} style={styles.up} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                        <View style={styles.item}>
                            <MaterialIcons name='south-west' size={20} style={styles.down} />
                            <Text style={styles.simpleText}>R$ 2.507,83</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.seeAllBtn}>
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
