import React, { useState, useContext, useEffect } from "react";
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

import Feather from "react-native-vector-icons/Feather";
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import colors from "../styles/colors";


export function Expense() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [valor, setValor] = useState('');
    const [desc, setDesc] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();
    const { user: userContext } = useContext(AuthContext);

    const uid = userContext && userContext.uid;

    const handleBarCodeScanned = (scanningResult) => {
        if (!scanned) {
            const { data } = scanningResult;
            alert(data);
            let valueNFC = data.split("|")

            if (((typeof (+valueNFC[4])) == 'number') && !(isNaN(+valueNFC[4]))) {
                setValor(valueNFC[4]);
            }
            setModalVisible(false);
            console.log(valor)
        }
    };

    useEffect(() => {
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

    function handleSubmit() {
        Keyboard.dismiss();
        if (isNaN(parseFloat(valor))) {
            alert('Preencha todos os campos');
            return;
        }

        Alert.alert(
            'Confirmando dados',
            `Tipo: Despesa - Valor: R$ ${parseFloat(valor)} - Categoria: ${selectedCategory} - Descrição: ${desc}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Continuar',
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
            date: format(new Date(), 'dd/MM/yy'),
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
        setValor('');
        setDesc('');
        setSelectedCategory('');
        navigation.navigate('Página inicial');
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack />
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
                                    onPress={() => setModalContent(!modalContent)}
                                >
                                    <Feather name="x" size={24} />
                                </TouchableOpacity>
                            </View>
                            <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                                type={BarCodeScanner.Constants.Type.back}
                                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                style={[StyleSheet.absoluteFillObject, styles.scanner]}>
                                <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
                            </BarCodeScanner>
                        </View>
                    </View>
                </Modal>
                <Text>Expense</Text>
                <TextInput
                    placeholder="Valor desejado"
                    keyboardType="numeric"
                    returnKeyType="next"
                    type="number"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    value={valor}
                    onChangeText={text => setValor(text)}
                />
                <TouchableOpacity onPress={() => {setScanned(false); setModalVisible(true)}} style={{ backgroundColor: 'rgba(236, 139, 94, .6)', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 50 }}>
                    <Text style={{ color: colors.white, fontWeight: 'bold', letterSpacing: .5, fontSize: 15 }}>Ler qr code</Text>
                </TouchableOpacity>
                <TextInput
                    placeholder="Descrição"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    value={desc}
                    onChangeText={text => setDesc(text)}
                />
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={item =>
                        setSelectedCategory(item)
                    }>
                    <Picker.Item label='Categoria' value='' />
                    {
                        categories.map(category =>
                            <Picker.Item key={category} label={category} value={category} />
                        )
                    }
                </Picker>
                <TouchableWithoutFeedback onPress={handleSubmit}>
                    <Text>Registrar</Text>
                </TouchableWithoutFeedback>
            </View>
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
        backgroundColor: 'rgba(0, 0, 0, .4)'
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: '90%',
        height: '60%',
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
