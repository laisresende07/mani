import React from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
// import { parse } from 'fast-xml-parser';

// getXMLResponse = () => {
//     fetch('https://gist.githubusercontent.com/Pavneet-Sing/d0f3324f2cd3244a6ac8ffc5e8550102/raw/8ebc801b3e4d4987590958978ae58d3f931193a3/XMLResponse.xml')
//         .then((response) => response.text())
//         .then((textResponse) => {
//             let obj = parse(textResponse);
//             let fname = obj.person.fname;
//             let lname = obj.person.lname;
//             let phone = obj.person.contacts.personal.phone;
//             this.setState({ fname: fname, lname: lname, phone: phone })
//             alert('AAAAA')
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }



export function News() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>News</Text>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default News;
