import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NumberFormat from 'react-number-format';
import Collapsible from 'react-native-collapsible';
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function HistoricoList({ data, showDate }) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    return (
        <TouchableWithoutFeedback onPress={() => setIsCollapsed(!isCollapsed)}>
            <View style={styles.item}>
                <View style={styles.row}>
                    <MaterialIcons
                        name={data.tipo === 'despesa' ? 'north-east' : 'south-west'}
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
                    {
                        showDate &&
                        <Text style={styles.date}>
                            {data.date}
                        </Text>
                    }
                </View>
                <Collapsible collapsed={isCollapsed} style={styles.collapsible}>
                    {
                        data.categoria ?
                            <View style={styles.row}>
                                <MaterialIcons name='bookmark-border' size={20} color={colors.gray} />
                                <Text style={styles.simpleText}>{data.categoria}</Text>
                            </View> :
                            <Text style={{ height: 0 }}></Text>
                    }
                    {
                        data.descricao ?
                            <View style={styles.row}>
                                <MaterialIcons name='textsms' size={20} color={colors.gray} />
                                <Text style={styles.simpleText}>{data.descricao}</Text>
                            </View> :
                            <Text style={{ height: 0 }}></Text>
                    }
                </Collapsible>
            </View>
        </TouchableWithoutFeedback>
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
        borderWidth: .5,
        borderColor: colors.orange,
        borderRadius: 6,
        padding: 10,
        marginVertical: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    collapsible: {
        paddingTop: 10,
        paddingLeft: 42
    },
    date: {
        color: colors.gray,
        fontFamily: fonts.regular,
        fontSize: 16,
        position: 'absolute',
        right: 0
    }
});

