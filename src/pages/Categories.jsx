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
import { MaterialIcons, Feather } from "@expo/vector-icons";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { HistoricoList } from "../components/HistoricoList";

export function Categories() {
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
            '',
            `Deletar categoria ${item}?`,
            [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
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
                    list.unshift({
                        key: childItem.key,
                        tipo: childItem.val().tipo,
                        valor: childItem.val().valor,
                        data: childItem.val().date,
                        date: childItem.val().date,
                        descricao: childItem.val().descricao,
                        categoria: childItem.val().categoria
                    });

                    setCategoryContent(list);
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
                                onChangeText={text => setCategory(text)}
                                style={styles.input} />
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setCategory('')
                                    }}
                                >
                                    <Text style={styles.textClose}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonOpen]}
                                    onPress={() => handleAddCategory()}
                                >
                                    <Text style={styles.textOpen}>Adicionar</Text>
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
                            <View style={{ position: 'relative', width: '100%', marginBottom: 15 }}>
                                <Text style={styles.selectedCategoryTitle}>{selectedCategory}</Text>
                                <TouchableOpacity
                                    style={{ position: 'absolute', right: 0, top: 0 }}
                                    onPress={() => setModalContent(!modalContent)}
                                >
                                    <Feather name="x" size={24} color={colors.blue} />
                                </TouchableOpacity>
                            </View>
                            {
                                categoryContent.length > 0 ?
                                    <FlatList
                                        style={styles.list}
                                        showsVerticalScrollIndicator={false}
                                        data={categoryContent}
                                        keyExtractor={item => item.key}
                                        renderItem={({ item }) => <HistoricoList data={item} showDate={true} />}
                                    />
                                    :
                                    <View style={styles.empty}>
                                        <Text style={styles.simpleText}>Sem movimentações nesta categoria.</Text>
                                    </View>
                            }
                        </View>
                    </View>
                </Modal>
                <Text style={styles.title}>Categorias</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => setMode('receita')} style={mode == 'receita' ? [styles.buttonsHeader, styles.buttonsHeaderIncomeActive] : styles.buttonsHeader}>
                        <MaterialIcons name="north-east" size={20} color={colors.green} />
                        <Text style={mode == 'receita' ? [styles.textButtonsHeader, styles.textButtonsHeaderActive] : styles.textButtonsHeader}>Receita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMode('despesa')} style={mode == 'despesa' ? [styles.buttonsHeader, styles.buttonsHeaderExpenseActive] : styles.buttonsHeader}>
                        <MaterialIcons name="south-west" size={20} color={colors.red} />
                        <Text style={mode == 'despesa' ? [styles.textButtonsHeader, styles.textButtonsHeaderActive] : styles.textButtonsHeader}>Despesa</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={mode == 'receita' ? incomeCategories : expenseCategories}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => getCategoryContent(item)} style={{ marginBottom: 15, borderWidth: .5, borderColor: colors.blue, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.categoryItem}>{item}</Text>
                                <TouchableOpacity onPress={() => confirmDelete(item)}>
                                    <Feather name="x" size={20} color={colors.blue} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    />

                    <View style={{ position: 'absolute', bottom: 10, paddingVertical: 20, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={mode == 'receita' ? styles.addIncomeCategory : styles.addExpenseCategory}>
                            <Text style={styles.textAddCategory}>Adicionar categoria</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    list: {
        width: '100%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        flex: 1,
    },
    buttonOpen: {
        borderWidth: 1,
        borderColor: colors.green,
        backgroundColor: colors.green,
        marginLeft: 10
    },
    buttonClose: {
        borderWidth: 1,
        borderColor: colors.red,
        backgroundColor: colors.white,
        marginRight: 10
    },
    textOpen: {
        color: "white",
        fontSize: 15,
        textTransform: "uppercase",
        letterSpacing: .5,
        textAlign: "center",
        fontFamily: fonts.regular
    },
    textClose: {
        color: colors.red,
        fontSize: 15,
        textTransform: "uppercase",
        letterSpacing: .5,
        textAlign: "center",
        fontFamily: fonts.regular
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
        fontFamily: fonts.semibold
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        height: 50,
        width: '100%',
        borderRadius: 6,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
        fontFamily: fonts.regular
    },
    buttonsHeader: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: "rgba(0, 0, 0, 0.1)",
        width: 122,
        height: 38,
        alignItems: 'center',
        borderRadius: 50,
        padding: 12
    },
    buttonsHeaderIncomeActive: {
        borderColor: colors.green
    },
    buttonsHeaderExpenseActive: {
        borderColor: colors.red
    },
    textButtonsHeader: {
        fontSize: 16,
        marginLeft: 8,
        fontFamily: fonts.regular
    },
    textButtonsHeaderActive: {
        fontFamily: fonts.semibold
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        color: colors.orange,
        fontFamily: fonts.semibold,
        textTransform: 'uppercase',
        letterSpacing: .7,
        marginBottom: 15
    },
    addIncomeCategory: {
        backgroundColor: colors.green,
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 50
    },
    addExpenseCategory: {
        backgroundColor: colors.red,
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 50
    },
    textAddCategory: {
        color: colors.white,
        fontFamily: fonts.semibold,
        letterSpacing: .5,
        fontSize: 15
    },
    selectedCategoryTitle: {
        textAlign: 'center',
        color: colors.blue,
        textTransform: 'uppercase',
        fontSize: 18,
        letterSpacing: .7,
        fontFamily: fonts.regular
    },
    empty: {
        fontFamily: fonts.regular,
        fontSize: 16
    },
    categoryItem: {
        fontFamily: fonts.regular,
        fontSize: 16
    }
});

export default Categories;
