import React, { useState, useContext, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    TouchableWithoutFeedback,
    ScrollView
} from "react-native";
import firebase from '../services/firebaseConnection';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../contexts/auth';
import { HeaderBack } from "../components/HeaderBack";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import moment from "moment";
import { HistoricoList } from "../components/HistoricoList";
import NumberFormat from 'react-number-format';

export function MontlyRecords() {
    moment.locale('pt', {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    })
    const [selectedYear, setSelectedYear] = useState(moment(new Date()).year());
    const [selectedMonth, setSelectedMonth] = useState(moment(new Date()).month());
    const months = moment.monthsShort();
    const getYears = (back) => {
        const year = new Date().getFullYear();
        return Array.from({ length: back }, (v, i) => ((year - back + i + 1).toString()));
    }

    const years = getYears(5).reverse();
    const [values, setValues] = useState([]);
    const [receitas, setReceitas] = useState(0);
    const [despesas, setDespesas] = useState(0);

    const { user } = useContext(AuthContext);
    const uid = user && user.uid;

    useEffect(() => {
        loadValues(selectedMonth, selectedYear)
    }, [])

    function handleSelectYear(item) {
        setSelectedYear(item)
        loadValues(selectedMonth, item)
    }

    function handleSelectMonth(item) {
        setSelectedMonth(item)
        loadValues(item, selectedYear)
    }


    async function loadValues(month, year) {

        await firebase
            .database()
            .ref('historico')
            .child(uid)
            .orderByChild('date')
            .on('value', snapshot => {
                setValues([]);
                let list = [];

                snapshot.forEach(childItem => {
                    let monthVal = childItem.val().date.split('/')[1]
                    let yearVal = childItem.val().date.split('/')[2]
                    if (monthVal[0] == '0') {
                        monthVal = monthVal.substring(1)
                    }

                    if (monthVal == month + 1 && yearVal == year) {
                        list.unshift({
                            key: childItem.key,
                            tipo: childItem.val().tipo,
                            valor: childItem.val().valor,
                            data: childItem.val().date,
                            date: childItem.val().date,
                            descricao: childItem.val().descricao,
                            categoria: childItem.val().categoria
                        });
                    }
                });

                setValues(list);
            });

        await firebase
            .database()
            .ref('historico')
            .child(uid)
            .orderByChild('date')
            .on('value', snapshot => {

                let rec = 0, desp = 0;

                snapshot.forEach(childItem => {
                    let monthVal = childItem.val().date.split('/')[1]
                    let yearVal = childItem.val().date.split('/')[2]
                    if (monthVal[0] == '0') {
                        monthVal = monthVal.substring(1)
                    }

                    if (monthVal == month + 1 && yearVal == year) {
                        if (childItem.val().tipo == 'despesa') {
                            desp += childItem.val().valor;
                        } else {
                            rec += childItem.val().valor;
                        }
                    }

                    setReceitas(rec);
                    setDespesas(desp);
                });
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack />
            <ScrollView style={styles.innerContainer} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Escolha o ano e o mês</Text>
                    <View style={styles.yearPicker}>
                        <Picker
                            selectedValue={selectedYear}
                            onValueChange={item =>
                                handleSelectYear(item)
                            }>
                            {
                                years.map(year =>
                                    <Picker.Item key={year} label={year} value={year} />
                                )
                            }
                        </Picker>
                    </View>
                    <FlatList
                        data={months}
                        renderItem={({ item, index }) => (
                            <View
                                style={index == selectedMonth ? [styles.months, styles.activeMonth] : styles.months}>
                                <TouchableWithoutFeedback onPress={() => handleSelectMonth(index)}>
                                    <Text style={index == selectedMonth ? [styles.textMonths, styles.textActiveMonth] : styles.textMonths}>{item}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                        numColumns={4}
                        keyExtractor={(item, index) => index}
                    />

                    <View >
                        <Text style={styles.selectedDate}>{moment.months(selectedMonth)} {selectedYear}</Text>

                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={styles.amount}>
                                    <MaterialIcons name='south-west' size={20} style={styles.up} />
                                    <Text style={styles.simpleText}>
                                        <NumberFormat
                                            value={receitas}
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
                                <View style={styles.amount}>
                                    <MaterialIcons name='north-east' size={20} style={styles.down} />
                                    <Text style={styles.simpleText}>
                                        <NumberFormat
                                            value={despesas}
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
                            </View>
                            {
                                values.length > 0 ?
                                    <FlatList
                                        style={styles.list}
                                        showsVerticalScrollIndicator={false}
                                        data={values}
                                        keyExtractor={item => item.key}
                                        renderItem={({ item }) => <HistoricoList data={item} showDate={true} />}
                                    />
                                    :
                                    <View style={styles.empty}>
                                        <Text style={styles.simpleText}>Sem movimentações neste mês.</Text>
                                    </View>
                            }
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 20,
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
        marginBottom: 30,
        marginHorizontal: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    list: {
        marginTop: 10
    },
    months: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderRadius: 4,
        borderWidth: .5,
        borderColor: colors.blue,
    },
    activeMonth: {
        borderWidth: 2,
        padding: 9
    },
    textMonths: {
        textAlign: 'center',
        color: colors.blue,
        textTransform: 'uppercase'
    },
    textActiveMonth: {
        fontWeight: 'bold'
    },
    yearPicker: {
        paddingLeft: 10,
        margin: 10,
        borderRadius: 4,
        borderWidth: .5,
        borderColor: colors.blue,
    },
    title: {
        fontFamily: fonts.semibold,
        color: colors.orange,
        fontSize: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: .7,
        marginVertical: 10
    },
    selectedDate: {
        fontFamily: fonts.semibold,
        color: colors.blue,
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: .7,
        marginTop: 15,
        marginBottom: 5,
        marginHorizontal: 10
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
    empty: {
        marginTop: 20
    }
});

export default MontlyRecords;
