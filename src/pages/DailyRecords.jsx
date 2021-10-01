import React, { useState, useContext, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    ScrollView
} from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import firebase from '../services/firebaseConnection';
import { AuthContext } from '../contexts/auth';
import { HeaderBack } from "../components/HeaderBack";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import moment from "moment";
import { HistoricoList } from "../components/HistoricoList";
import NumberFormat from 'react-number-format';

export function DailyRecords() {
    moment.locale('pt', {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    })
    const [selectedStartDate, setSelectedStartDate] = useState();
    const [values, setValues] = useState([]);
    const startDate = selectedStartDate ? selectedStartDate : new Date();
    const [receitas, setReceitas] = useState(0);
    const [despesas, setDespesas] = useState(0);

    const { user } = useContext(AuthContext);
    const uid = user && user.uid;

    useEffect(() => {
        setSelectedStartDate(new Date())
        loadValues(startDate)
    }, [])
    

    function onDateChange(date) {
        setSelectedStartDate(date);
        loadValues(date);
    }

    async function loadValues(date) {
        await firebase
            .database()
            .ref('historico')
            .child(uid)
            .orderByChild('date')
            .equalTo(moment(date).format('DD/MM/YYYY'))
            .on('value', snapshot => {
                setValues([]);
                let list = [];

                snapshot.forEach(childItem => {
                    list.unshift({
                        key: childItem.key,
                        tipo: childItem.val().tipo,
                        valor: childItem.val().valor,
                        date: childItem.val().date,
                        descricao: childItem.val().descricao,
                        categoria: childItem.val().categoria
                    });
                });

                setValues(list);
            });

            await firebase
                .database()
                .ref('historico')
                .child(uid)
                .orderByChild('date')
                .equalTo(moment(date).format('DD/MM/YYYY'))
                .on('value', snapshot => {

                    let rec = 0, desp = 0;

                    snapshot.forEach(childItem => {
                        if (childItem.val().tipo == 'despesa') {
                            desp += childItem.val().valor;
                        } else {
                            rec += childItem.val().valor;
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
                <Text style={styles.title}>Escolha o dia</Text>
                <View style={styles.calendar}>
                    <CalendarPicker
                        onDateChange={(date) => onDateChange(date)}
                        weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
                        months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                        previousComponent={<AntDesign name={"left"} size={20} color={colors.blue} />}
                        nextComponent={<AntDesign name={"right"} size={20} color={colors.blue} />}
                        selectedDayStyle={styles.selectedDay}
                        todayBackgroundColor={colors.backgroundColor}
                        selectMonthTitle={"Selecione o mês de "}
                        selectYearTitle={"Selecione o ano"}
                        width={Dimensions.get("window").width * 0.9}
                        maxDate={new Date()}
                        textStyle={{
                            fontSize: 15
                        }}
                    />
                </View>

                <View>
                    <Text style={styles.selectedDate}>{(moment(startDate).format('DD  MMMM  YYYY')).toString()}</Text>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.amount}>
                                <MaterialIcons name='south-east' size={20} style={styles.up} />
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
                                    <Text style={styles.simpleText}>Sem movimentações neste dia.</Text>
                                </View>
                        }
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
        marginHorizontal: 20
    },
    title: {
        fontFamily: fonts.semibold,
        color: colors.orange,
        fontSize: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: .7,
        marginTop: 10
    },
    selectedDay: {
        backgroundColor: colors.orange,
    },
    calendar: {
        borderWidth: .5,
        borderColor: colors.blue,
        padding: 10,
        borderRadius: 8,
        marginVertical: 15,
        marginHorizontal: 5
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
        marginHorizontal: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    list: {
        marginTop: 10
    },
    selectedDate: {
        fontFamily: fonts.semibold,
        color: colors.blue,
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: .7,
        marginTop: 15,
        marginBottom: 5,
        marginHorizontal: 5
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

export default DailyRecords;
