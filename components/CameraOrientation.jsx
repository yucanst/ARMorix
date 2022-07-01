import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CameraOrientation({ navigation }) {
    const [orientation, setOrientation] = useState('portrait')

    function onSubmit() {
        console.log(orientation);
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='phone-portrait-outline' onPress={() => navigation.navigate('Camera')}/>
                <Text>Portrait</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='phone-landscape-outline' onPress={() => navigation.navigate('Camera')}/>
                <Text>Landscape</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        textAlign: 'center',
        paddingBottom: 30
    },
    icon: {
        fontSize: '50vw'
    },
});
