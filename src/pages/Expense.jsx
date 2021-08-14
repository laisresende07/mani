import React, { useState, useContext, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    TextInput,
    View,
    Dimensions
} from "react-native";
import { AuthContext } from '../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import firebase from '../services/firebaseConnection';

import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

const finderWidth = 280;
const finderHeight = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

export function Expense() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [valor, setValor] = useState('');
    const [desc, setDesc] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleBarCodeScanned = (scanningResult) => {
        if (!scanned) {
            const { type, data, bounds: { origin } = {} } = scanningResult;
            const { x, y } = origin;
            if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                setScanned(true);
                alert(`Bar code with type ${type} and data ${data} has been scanned!`);
                console.log(data)
            }
        }
    };

    useEffect(() => {
        // (async () => {
        //     const { status } = await Camera.requestPermissionsAsync();
        //     setHasPermission(status === 'granted');
        // })();

        async function loadCategories() {

            await firebase
                .database()
                .ref('categorias')
                .child(uid)
                .on('value', snapshot => {
                    setCategories([]);
                    let list = [];

                    snapshot.forEach(childItem => {
                        console.log(childItem)
                        if (childItem.val().tipo == 'despesa') {
                            list.push(childItem.val().nome)
                        }
                    });

                    setCategories(list);
                });
        }

        loadCategories();

    }, []);

    const navigation = useNavigation();
    const { user: userContext } = useContext(AuthContext);

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
            <Text>Expense</Text>
            <TextInput
                placeholder="Valor desejado"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => Keyboard.dismiss()}
                value={valor}
                onChangeText={text => setValor(text)}
            />
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
            {/* <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                            type={BarCodeScanner.Constants.Type.back}
                            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                            style={[StyleSheet.absoluteFillObject, styles.container]}>
                <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>
            </BarCodeScanner> */}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30
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
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});

export default Expense;
