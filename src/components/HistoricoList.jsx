import React from 'react'; 
import {
    Text,
    View,
    StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NumberFormat from 'react-number-format';
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function HistoricoList ({ data }) {
    return (
        <View style={styles.item}>
            <MaterialIcons
                name={data.tipo === 'despesa' ? 'south-west' : 'north-east'}
                size={20}
                style={data.tipo === 'despesa' ? styles.down : styles.up}
            />
            <Text style={styles.simpleText}>
                <NumberFormat
                    value={data.valor}
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
    );
}

const styles = StyleSheet.create({
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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: colors.orange,
        borderRadius: 6,
        padding: 10,
        marginTop: 10
    },
});

