import React, { useState, useContext, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    View,
    FlatList,
    Alert,
    Modal,
    TextInput
} from "react-native";
import { MainHeader } from '../components/MainHeader';

import firebase from '../services/firebaseConnection';
import { AuthContext } from '../contexts/auth';

import { useNavigation } from "@react-navigation/core";
import Feather from "react-native-vector-icons/Feather";
import colors from "../styles/colors";

export function Categories() {
    const navigation = useNavigation();

    const { user } = useContext(AuthContext);
    const uid = user && user.uid;

    const [category, setCategory] = useState('');
    const [categoryContent, setCategoryContent] = useState([]);
    const [mode, setMode] = useState('receita');
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {
        async function loadCategories() {

            await firebase
                .database()
                .ref('categorias')
                .child(uid)
                .on('value', snapshot => {
                    setIncomeCategories([]);
                    setExpenseCategories([]);
                    let income = [], expense = [];

                    snapshot.forEach(childItem => {
                        if (childItem.val().tipo == 'receita') {
                            income.push(childItem.key)
                        } else {
                            expense.push(childItem.key)
                        }
                    });

                    setIncomeCategories(income);
                    setExpenseCategories(expense);
                });
        }

        loadCategories();
    }, []);

    async function handleAddCategory() {
        let uid = user.uid;

        await firebase
            .database()
            .ref("categorias")
            .child(uid)
            .child(category)
            .set({
                tipo: mode,
            });

        setCategory('')
        setModalVisible(!modalVisible)
    }

    function confirmDelete(item) {
        Alert.alert(
            'Confirmando dados',
            `Tem certeza que quer deletar a categoria ${item}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Continuar',
                    onPress: () => deleteCategory(item)
                }
            ]
        )


    }

    async function deleteCategory(item) {
        let uid = user.uid;

        await firebase
            .database()
            .ref("categorias")
            .child(uid)
            .child(item)
            .remove();
    }

    async function getCategoryContent(item) {
        setSelectedCategory(item)
        await firebase
            .database()
            .ref('historico')
            .child(uid)
            .orderByChild('categoria')
            .equalTo(item)
            .on('value', snapshot => {
                setCategoryContent([]);
                let list = [];

                snapshot.forEach(childItem => {
                    list.push({
                        key: childItem.key,
                        descricao: childItem.val().descricao,
                        date: childItem.val().date,
                        valor: childItem.val().valor,
                    });

                    setCategoryContent(list);
                    // console.log(list)
                });
            });

        setModalContent(!modalContent)
    }


    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />
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
                            <Text style={styles.modalText}>Nova categoria</Text>
                            <TextInput
                                placeholder="Nome da categoria"
                                value={category}
                                onChangeText={text => setCategory(text)} />
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => handleAddCategory()}
                                >
                                    <Text style={styles.textStyle}>Adicionar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    statusBarTranslucent={true}
                    transparent={true}
                    visible={modalContent}
                    onRequestClose={() => {
                        setModalVisible(!modalContent);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView2}>
                            <View style={{position: 'relative', width: '100%'}}>
                                <Text style={{ textAlign: 'center'}}>{selectedCategory}</Text>
                                <TouchableOpacity
                                    style={{position: 'absolute', right: 0, top: 0}}
                                    onPress={() => setModalContent(!modalContent)}
                                >
                                    <Feather name="x" size={24} />
                                </TouchableOpacity>
                            </View>
                            {
                                categoryContent.length > 0 ?
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={categoryContent}
                                        renderItem={({ item }) => (
                                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', width: '70%' }}>
                                                <Text>{item.valor}</Text>
                                                <Text>{item.descricao}</Text>
                                                <Text>{item.date}</Text>
                                                {/* {console.log((item.date).slice(-5, -3))}      mes */}
                                                {/* {console.log((item.date).slice(-2))}      ano */}
                                            </View>
                                        )}
                                    /> :
                                    <Text style={{ flex: 1 }}>Sem registros</Text>
                            }
                        </View>
                    </View>
                </Modal>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => setMode('receita')}>
                        <Text>Receita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMode('despesa')}>
                        <Text>Despesa</Text>
                    </TouchableOpacity>
                </View>
                {
                    (mode == 'receita') ?
                        <View style={{ flex: 1 }}>
                            <Text>RECEITA</Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={incomeCategories}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => getCategoryContent(item)} style={{ marginBottom: 30, borderWidth: 1, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>{item}</Text>
                                        <TouchableOpacity onPress={() => confirmDelete(item)}>
                                            <Feather name="trash-2" size={20} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )}
                            />

                            <View style={{ position: 'absolute', bottom: 10, paddingVertical: 20, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: colors.green, paddingHorizontal: 25, paddingVertical: 15, borderRadius: 50 }}>
                                    <Text style={{ color: colors.white, fontWeight: 'bold', letterSpacing: .5, fontSize: 15 }}>Adicionar categoria</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <Text>DESPESA</Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={expenseCategories}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => getCategoryContent(item)} style={{ marginBottom: 30, borderWidth: 1, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>{item}</Text>
                                        <TouchableOpacity onPress={() => confirmDelete(item)}>
                                            <Feather name="trash-2" size={20} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )}
                            />
                            <View style={{ position: 'absolute', bottom: 10, paddingVertical: 20, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: colors.red, paddingHorizontal: 25, paddingVertical: 15, borderRadius: 50 }}>
                                    <Text style={{ color: colors.white, fontWeight: 'bold', letterSpacing: .5, fontSize: 15 }}>Adicionar categoria</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
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
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: '90%',
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
    modalView2: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: '90%',
        height: '80%',
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default Categories;
