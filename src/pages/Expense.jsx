import React, { useState, useContext, useEffect, useRef } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    TextInput,
    View,
    Dimensions,
    Modal
} from "react-native";
import { AuthContext } from '../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import firebase from '../services/firebaseConnection';
import { HeaderBack } from "../components/HeaderBack";
import DateTimePicker from '@react-native-community/datetimepicker';

import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { FakeCurrencyInput } from 'react-native-currency-input'
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Expense() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [valor, setValor] = useState(0);
    const [desc, setDesc] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const inputValue = useRef(null)

    const navigation = useNavigation();
    const { user: userContext } = useContext(AuthContext);

    const uid = userContext && userContext.uid;

    const handleBarCodeScanned = (scanningResult) => {
        if (!scanned) {
            const { data } = scanningResult;
            alert(data);
            console.log(data)
            let valueNFC = data.split("|")

            if (((typeof (+valueNFC[4])) == 'number') && !(isNaN(+valueNFC[4]))) {
                setValor(valueNFC[4]);
            }
            setModalVisible(false);
            console.log(valor)
        }
    };

    useEffect(() => {
        setValor(0);
        setDesc('');
        setSelectedCategory('');
        setDate(new Date);

        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        async function loadCategories() {

            await firebase
                .database()
                .ref('categorias')
                .child(uid)
                .on('value', snapshot => {
                    setCategories([]);
                    let list = [];

                    snapshot.forEach(childItem => {
                        if (childItem.val().tipo == 'despesa') {
                            list.push(childItem.key)
                        }
                    });

                    setCategories(list);
                });
        }

        loadCategories();

    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    function handleCancel() {
        Keyboard.dismiss();
        setValor(0);
        setDesc('');
        setSelectedCategory('');
        setDate(new Date);
        navigation.navigate('Página inicial')
    }

    function handleSubmit() {
        Keyboard.dismiss();
        if (valor == 0) {
            Alert.alert(
                '',
                `Preencha o valor`,
            )
            return;
        }

        Alert.alert(
            'Confirmando dados',
            `Tipo: Despesa \nValor: R$ ${parseFloat(valor)} \nData: ${format(date, 'dd/MM/yyyy')} \nDescrição: ${desc} \nCategoria: ${selectedCategory}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Adicionar',
                    onPress: () => handleAdd()
                }
            ]
        )
    }

    async function handleAdd() {
        let uid = userContext.uid;

        let key = await firebase.database().ref('historico').child(uid).push().key;
        await firebase.database().ref('historico').child(uid).child(key).set({
            tipo: 'despesa',
            valor: parseFloat(valor),
            date: format(date, 'dd/MM/yyyy'),
            categoria: selectedCategory,
            descricao: desc
        })

        let user = firebase.database().ref('users').child(uid);
        await user.once('value').then((snapshot) => {
            let saldo = parseFloat(snapshot.val().saldo);

            saldo -= parseFloat(valor);

            user.child('saldo').set(saldo);
        });

        Keyboard.dismiss();
        setValor(0);
        setDesc('');
        setDate(new Date);
        setSelectedCategory('');
        navigation.navigate('Página inicial');
    }

    const handleSelectDate = (event, selectedDate) => {
        setShowDatePicker(false)
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const handleFocusValue = () => {
        inputValue.current.focus();
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack title="Nova despesa" />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.container}>
                <View style={styles.innerContainer}>
                    <Modal
                        animationType="fade"
                        statusBarTranslucent={true}
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ position: 'relative', width: '100%' }}>
                                    <Text style={{ textAlign: 'center' }}>Scanner</Text>
                                    <TouchableOpacity
                                        style={{ position: 'absolute', right: 0, top: 0 }}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Feather name="x" size={24} />
                                    </TouchableOpacity>
                                </View>
                                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                                    type={BarCodeScanner.Constants.Type.back}
                                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                    style={[StyleSheet.absoluteFillObject, styles.scanner]}
                                >
                                    <View style={{width: '100%', height: '20%', backgroundColor: 'rgba(0,0,0,.5)'}} />
                                    <BarcodeMask showAnimatedLine height='100%' width='100%' edgeBorderWidth={0} animatedLineColor={colors.blue} animatedLineWidth='80%' />
                                    <View style={{width: '100%', height: '20%', backgroundColor: 'rgba(0,0,0,.5)', position: 'absolute', bottom: 0, borderBottomEndRadius: 20, borderBottomLeftRadius: 20}} />
                                </BarCodeScanner>
                            </View>
                        </View>
                    </Modal>
                    <Text style={styles.labelValue}>Valor</Text>
                    <View style={styles.inputValueView}>
                        <FakeCurrencyInput
                            value={valor}
                            onChangeValue={(text) => setValor(text)}
                            prefix="R$ "
                            delimiter="."
                            separator=","
                            precision={2}
                            placeholder="R$ 0,00"
                            style={styles.valueInput}
                            ref={inputValue}
                            caretHidden={true}
                            minValue={0}
                        />
                        <TouchableWithoutFeedback onPress={handleFocusValue}>
                            <MaterialIcons name='edit' size={30} color={colors.orange} />
                        </TouchableWithoutFeedback>
                    </View>

                    <TouchableOpacity onPress={() => { setScanned(false); setModalVisible(true) }} style={{ backgroundColor: 'rgba(236, 139, 94, .6)', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                        <MaterialIcons name="qr-code-2" size={24} color={colors.blue} />
                        <Text style={{ color: colors.blue, fontFamily: fonts.semibold, letterSpacing: .5, fontSize: 15, marginLeft: 10 }}>ESCANEAR NOTA FISCAL</Text>
                    </TouchableOpacity>

                    <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
                        <View style={styles.inputIconView}>
                            <MaterialIcons name="today" size={25} style={styles.icon} />
                            <Text style={styles.textInput}>{format(date, 'dd/MM/yyyy')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            is24Hour={true}
                            display="default"
                            onChange={handleSelectDate}
                            maximumDate={new Date()}
                        />
                    )}

                    <View style={styles.inputIconView}>
                        <MaterialIcons name="textsms" size={22} style={styles.icon} />
                        <TextInput
                            placeholder="Descrição"
                            returnKeyType="next"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            value={desc}
                            onChangeText={text => setDesc(text)}
                            multiline={true}
                            caretHidden={true}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.picker}>
                        <MaterialIcons name="bookmark-border" size={24} style={styles.iconAbsolute} />
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={item =>
                                setSelectedCategory(item)
                            }
                            style={selectedCategory == '' ? styles.placeholder : styles.normalInput}
                        >
                            <Picker.Item label='Categoria' value='' />
                            {
                                categories.map(category =>
                                    <Picker.Item key={category} label={category} value={category} />
                                )
                            }
                        </Picker>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableWithoutFeedback onPress={handleCancel}>
                            <View style={[styles.button, styles.cancel]}>
                                <MaterialIcons name="close" size={34} color={colors.red} />
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={handleSubmit}>
                            <View style={[styles.button, styles.confirm]}>
                                <MaterialIcons name="done" size={34} color={colors.white} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
    valueInput: {
        color: colors.orange,
        fontFamily: fonts.semibold,
        fontSize: 30,
        letterSpacing: .7,
    },
    inputIconView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: colors.orange,
        borderRadius: 4,
        marginVertical: 7,
        minHeight: 50,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    inputValueView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    icon: {
        color: 'rgba(0, 0, 0, .3)',
        marginRight: 10
    },
    iconAbsolute: {
        color: 'rgba(0, 0, 0, .3)',
        position: 'absolute',
        left: 15,
        top: 13,
    },
    textInput: {
        fontSize: 17,
        width: '100%',
        flex: 1,
        fontFamily: fonts.regular
    },
    picker: {
        borderWidth: .5,
        borderColor: colors.orange,
        borderRadius: 4,
        marginVertical: 7,
        minHeight: 50,
        paddingLeft: 40,
        position: 'relative'
    },
    placeholder: {
        color: 'rgba(0, 0, 0, .4)',
        fontSize: 16
    },
    normalInput: {
        color: '#000'
    },
    labelValue: {
        fontSize: 16,
        color: colors.blue,
        marginTop: 60
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
        width: '100%'
    },
    button: {
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
    confirm: {
        backgroundColor: colors.green
    },
    cancel: {
        backgroundColor: colors.shape,
        borderWidth: 1,
        borderColor: colors.red
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    camera: {
        height: Dimensions.get("window").width * 0.8,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    scanner: {
        marginTop: 60,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: '90%',
        height: '75%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

});

export default Expense;
